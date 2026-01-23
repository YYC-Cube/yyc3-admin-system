#!/bin/bash

# K6性能测试执行脚本
# Phase 5.2 - 性能与压力测试
# 使用方法: ./run-performance-tests.sh [test-type]
# test-type: all|api|db|concurrent|cache|payment|upload|websocket|stress

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 加载配置: 仅在未设置相关环境变量时从 config.env 加载默认值
if [ -f "performance/config.env" ]; then
    if [ -z "$BASE_URL" ] && [ -z "$WS_URL" ]; then
        source performance/config.env
        echo -e "${GREEN}✓ 配置文件加载成功（使用 performance/config.env 中的默认值）${NC}"
    else
        echo -e "${YELLOW}⚠ 环境变量已设置，跳过从 performance/config.env 覆盖（BASE_URL=$BASE_URL, WS_URL=$WS_URL）${NC}"
    fi
else
    echo -e "${RED}✗ 配置文件不存在: performance/config.env${NC}"
    exit 1
fi

# 创建结果目录
mkdir -p performance/results

# 显示横幅
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════╗"
echo "║         YYC3-KTV 性能测试执行器                       ║"
echo "║         Phase 5.2 - K6 Performance Testing            ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查K6是否安装
if ! command -v k6 &> /dev/null; then
    echo -e "${RED}✗ K6未安装${NC}"
    echo "请运行以下命令安装K6:"
    echo "  macOS: brew install k6"
    echo "  Linux: sudo apt-get install k6"
    echo "  Windows: choco install k6"
    exit 1
fi

echo -e "${GREEN}✓ K6版本: $(k6 version)${NC}\n"

# 测试类型
TEST_TYPE=${1:-all}

# 运行单个测试
run_test() {
    local test_name=$1
    local test_file=$2

    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🚀 运行测试: ${test_name}${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

    local start_time=$(date +%s)

    if k6 run \
        --out json=performance/results/${test_name}-output.json \
        --summary-export=performance/results/${test_name}-summary.json \
        performance/${test_file}; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        echo -e "\n${GREEN}✓ ${test_name} 测试完成 (耗时: ${duration}s)${NC}\n"
        return 0
    else
        echo -e "\n${RED}✗ ${test_name} 测试失败${NC}\n"
        return 1
    fi
}

# 执行测试
case $TEST_TYPE in
    all)
        echo -e "${BLUE}📊 执行所有性能测试...${NC}\n"

        run_test "api-performance" "api-performance.js"
        run_test "db-performance" "db-performance.js"
        run_test "concurrent-users" "concurrent-users.js"
        run_test "cache-performance" "cache-performance.js"
        run_test "payment-stress" "payment-stress.js"
        run_test "upload-performance" "upload-performance.js"
        run_test "websocket-test" "websocket-test.js"
        run_test "comprehensive-stress" "comprehensive-stress.js"
        ;;
    api)
        run_test "api-performance" "api-performance.js"
        ;;
    db)
        run_test "db-performance" "db-performance.js"
        ;;
    concurrent)
        run_test "concurrent-users" "concurrent-users.js"
        ;;
    cache)
        run_test "cache-performance" "cache-performance.js"
        ;;
    payment)
        run_test "payment-stress" "payment-stress.js"
        ;;
    upload)
        run_test "upload-performance" "upload-performance.js"
        ;;
    websocket)
        run_test "websocket-test" "websocket-test.js"
        ;;
    stress)
        run_test "comprehensive-stress" "comprehensive-stress.js"
        ;;
    *)
        echo -e "${RED}✗ 未知的测试类型: ${TEST_TYPE}${NC}"
        echo "可用的测试类型: all|api|db|concurrent|cache|payment|upload|websocket|stress"
        exit 1
        ;;
esac

# 生成测试报告
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📄 生成测试报告...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# 检查是否有测试结果
if ls performance/results/*-summary.json 1> /dev/null 2>&1; then
    echo -e "${GREEN}✓ 测试结果已保存到: performance/results/${NC}"
    echo -e "${GREEN}✓ 可使用以下命令查看详细结果:${NC}"
    echo -e "  cat performance/results/*-summary.json | jq"
else
    echo -e "${YELLOW}⚠ 未找到测试结果文件${NC}"
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ 性能测试执行完成${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
