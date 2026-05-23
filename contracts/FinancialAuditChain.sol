// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FinancialAuditChain
 * @dev 财务审计链智能合约
 * 用于记录和验证关键财务数据
 */
contract FinancialAuditChain is Ownable, Pausable, ReentrancyGuard {
    
    // 财务交易记录
    struct Transaction {
        bytes32 dataHash;           // 数据哈希
        string transactionType;     // 交易类型
        uint256 amount;             // 交易金额
        uint256 timestamp;          // 记录时间
        address recorder;           // 记录人
        bool exists;                // 是否存在
    }
    
    // 交易ID => 交易记录
    mapping(string => Transaction) private transactions;
    
    // 所有交易ID列表
    string[] private transactionIds;
    
    // 授权记录员地址
    mapping(address => bool) private authorizedRecorders;
    
    // 事件
    event TransactionRecorded(
        string indexed transactionId,
        bytes32 dataHash,
        string transactionType,
        uint256 amount,
        uint256 timestamp
    );
    
    event RecorderAuthorized(address indexed recorder);
    event RecorderRevoked(address indexed recorder);
    
    constructor() Ownable(msg.sender) {
        // 合约部署者自动成为授权记录员
        authorizedRecorders[msg.sender] = true;
    }
    
    /**
     * @dev 记录财务交易
     * @param transactionId 交易ID
     * @param dataHash 数据哈希
     * @param transactionType 交易类型
     * @param amount 交易金额
     */
    function recordTransaction(
        string memory transactionId,
        bytes32 dataHash,
        string memory transactionType,
        uint256 amount
    ) public whenNotPaused returns (bool) {
        require(authorizedRecorders[msg.sender], "Not authorized recorder");
        require(!transactions[transactionId].exists, "Transaction already exists");
        require(dataHash != bytes32(0), "Invalid data hash");
        require(amount > 0, "Amount must be greater than 0");
        
        transactions[transactionId] = Transaction({
            dataHash: dataHash,
            transactionType: transactionType,
            amount: amount,
            timestamp: block.timestamp,
            recorder: msg.sender,
            exists: true
        });
        
        transactionIds.push(transactionId);
        
        emit TransactionRecorded(
            transactionId,
            dataHash,
            transactionType,
            amount,
            block.timestamp
        );
        
        return true;
    }
    
    /**
     * @dev 获取交易记录
     * @param transactionId 交易ID
     */
    function getTransaction(string memory transactionId)
        public
        view
        returns (
            bytes32 dataHash,
            string memory transactionType,
            uint256 amount,
            uint256 timestamp,
            address recorder
        )
    {
        require(transactions[transactionId].exists, "Transaction not found");
        
        Transaction memory txn = transactions[transactionId];
        return (
            txn.dataHash,
            txn.transactionType,
            txn.amount,
            txn.timestamp,
            txn.recorder
        );
    }
    
    /**
     * @dev 验证交易数据完整性
     * @param transactionId 交易ID
     * @param dataHash 待验证的数据哈希
     */
    function verifyTransaction(
        string memory transactionId,
        bytes32 dataHash
    ) public view returns (bool) {
        require(transactions[transactionId].exists, "Transaction not found");
        return transactions[transactionId].dataHash == dataHash;
    }
    
    /**
     * @dev 获取交易总数
     */
    function getTransactionCount() public view returns (uint256) {
        return transactionIds.length;
    }
    
    /**
     * @dev 批量获取交易ID
     * @param offset 起始位置
     * @param limit 数量限制
     */
    function getTransactionIds(uint256 offset, uint256 limit)
        public
        view
        returns (string[] memory)
    {
        require(offset < transactionIds.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > transactionIds.length) {
            end = transactionIds.length;
        }
        
        string[] memory result = new string[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = transactionIds[i];
        }
        
        return result;
    }
    
    /**
     * @dev 授权记录员
     * @param recorder 记录员地址
     */
    function authorizeRecorder(address recorder) public onlyOwner {
        require(recorder != address(0), "Invalid recorder address");
        require(!authorizedRecorders[recorder], "Already authorized");
        
        authorizedRecorders[recorder] = true;
        emit RecorderAuthorized(recorder);
    }
    
    /**
     * @dev 撤销记录员授权
     * @param recorder 记录员地址
     */
    function revokeRecorder(address recorder) public onlyOwner {
        require(authorizedRecorders[recorder], "Not authorized");
        
        authorizedRecorders[recorder] = false;
        emit RecorderRevoked(recorder);
    }
    
    /**
     * @dev 检查是否为授权记录员
     * @param recorder 记录员地址
     */
    function isAuthorizedRecorder(address recorder) public view returns (bool) {
        return authorizedRecorders[recorder];
    }
    
    /**
     * @dev 暂停合约
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev 恢复合约
     */
    function unpause() public onlyOwner {
        _unpause();
    }
}
