// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title LoyaltyPoints
 * @dev 会员积分智能合约
 * 功能：积分发放、转账、兑换、查询
 */
contract LoyaltyPoints is Ownable, ReentrancyGuard, Pausable {
    // 积分余额映射
    mapping(address => uint256) private balances;
    
    // 锁定余额映射（用于兑换中的积分）
    mapping(address => uint256) private lockedBalances;
    
    // 交易记录
    struct Transaction {
        bytes32 id;
        uint8 txType; // 0: issue, 1: transfer, 2: redeem
        address from;
        address to;
        uint256 amount;
        string reason;
        uint256 timestamp;
    }
    
    // 会员交易历史
    mapping(address => Transaction[]) private transactionHistory;
    
    // 交易ID到交易的映射
    mapping(bytes32 => Transaction) private transactions;
    
    // 总发行量
    uint256 public totalSupply;
    
    // 总兑换量
    uint256 public totalRedeemed;
    
    // 事件
    event PointsIssued(address indexed member, uint256 points, string reason, bytes32 txId);
    event PointsTransferred(address indexed from, address indexed to, uint256 points, bytes32 txId);
    event PointsRedeemed(address indexed member, uint256 points, string rewardId, bytes32 txId);
    event PointsLocked(address indexed member, uint256 points);
    event PointsUnlocked(address indexed member, uint256 points);
    
    constructor() Ownable(msg.sender) {
        totalSupply = 0;
        totalRedeemed = 0;
    }
    
    /**
     * @dev 发放积分（仅管理员）
     */
    function issuePoints(
        address member,
        uint256 points,
        string memory reason
    ) external onlyOwner whenNotPaused returns (bytes32) {
        require(member != address(0), "Invalid member address");
        require(points > 0, "Points must be greater than 0");
        
        // 增加余额
        balances[member] += points;
        totalSupply += points;
        
        // 生成交易ID
        bytes32 txId = keccak256(abi.encodePacked(
            block.timestamp,
            member,
            points,
            reason
        ));
        
        // 记录交易
        Transaction memory tx = Transaction({
            id: txId,
            txType: 0,
            from: address(0),
            to: member,
            amount: points,
            reason: reason,
            timestamp: block.timestamp
        });
        
        transactionHistory[member].push(tx);
        transactions[txId] = tx;
        
        emit PointsIssued(member, points, reason, txId);
        
        return txId;
    }
    
    /**
     * @dev 积分转账
     */
    function transferPoints(
        address from,
        address to,
        uint256 points
    ) external whenNotPaused returns (bytes32) {
        require(from != address(0) && to != address(0), "Invalid address");
        require(points > 0, "Points must be greater than 0");
        require(balances[from] >= points, "Insufficient balance");
        require(msg.sender == from || msg.sender == owner(), "Not authorized");
        
        // 转账
        balances[from] -= points;
        balances[to] += points;
        
        // 生成交易ID
        bytes32 txId = keccak256(abi.encodePacked(
            block.timestamp,
            from,
            to,
            points
        ));
        
        // 记录交易
        Transaction memory tx = Transaction({
            id: txId,
            txType: 1,
            from: from,
            to: to,
            amount: points,
            reason: "Transfer",
            timestamp: block.timestamp
        });
        
        transactionHistory[from].push(tx);
        transactionHistory[to].push(tx);
        transactions[txId] = tx;
        
        emit PointsTransferred(from, to, points, txId);
        
        return txId;
    }
    
    /**
     * @dev 积分兑换
     */
    function redeemPoints(
        address member,
        uint256 points,
        string memory rewardId
    ) external whenNotPaused returns (bytes32) {
        require(member != address(0), "Invalid member address");
        require(points > 0, "Points must be greater than 0");
        require(balances[member] >= points, "Insufficient balance");
        require(msg.sender == member || msg.sender == owner(), "Not authorized");
        
        // 扣除积分
        balances[member] -= points;
        totalRedeemed += points;
        
        // 生成交易ID
        bytes32 txId = keccak256(abi.encodePacked(
            block.timestamp,
            member,
            points,
            rewardId
        ));
        
        // 记录交易
        Transaction memory tx = Transaction({
            id: txId,
            txType: 2,
            from: member,
            to: address(0),
            amount: points,
            reason: string(abi.encodePacked("Redeem: ", rewardId)),
            timestamp: block.timestamp
        });
        
        transactionHistory[member].push(tx);
        transactions[txId] = tx;
        
        emit PointsRedeemed(member, points, rewardId, txId);
        
        return txId;
    }
    
    /**
     * @dev 锁定积分（用于兑换流程）
     */
    function lockPoints(address member, uint256 points) external onlyOwner {
        require(balances[member] >= points, "Insufficient balance");
        
        balances[member] -= points;
        lockedBalances[member] += points;
        
        emit PointsLocked(member, points);
    }
    
    /**
     * @dev 解锁积分
     */
    function unlockPoints(address member, uint256 points) external onlyOwner {
        require(lockedBalances[member] >= points, "Insufficient locked balance");
        
        lockedBalances[member] -= points;
        balances[member] += points;
        
        emit PointsUnlocked(member, points);
    }
    
    /**
     * @dev 查询余额
     */
    function balanceOf(address member) external view returns (uint256) {
        return balances[member];
    }
    
    /**
     * @dev 查询锁定余额
     */
    function lockedBalanceOf(address member) external view returns (uint256) {
        return lockedBalances[member];
    }
    
    /**
     * @dev 查询交易历史
     */
    function getTransactionHistory(address member) external view returns (Transaction[] memory) {
        return transactionHistory[member];
    }
    
    /**
     * @dev 验证交易
     */
    function verifyTransaction(bytes32 txId) external view returns (
        bool exists,
        uint256 amount,
        uint256 timestamp
    ) {
        Transaction memory tx = transactions[txId];
        exists = tx.timestamp > 0;
        amount = tx.amount;
        timestamp = tx.timestamp;
    }
    
    /**
     * @dev 暂停合约
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev 恢复合约
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
