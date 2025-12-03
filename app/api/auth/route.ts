import { NextRequest, NextResponse } from 'next/server';
import { mockService } from '../../../lib/api/mock-service';

/**
 * @description 认证管理API路由
 * @project KTV商家管理系统
 */

// 配置Edge Runtime以可能绕过CSRF保护
export const runtime = 'edge';

// 帮助函数：创建带有正确头信息的响应
function createResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  
  // 添加必要的CORS和安全头
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// 登录接口
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { username, password } = body;
    
    // 验证必填字段
    if (!username || !password) {
      return createResponse(
        { success: false, error: '缺少必填字段: username 或 password' },
        400
      );
    }
    
    // 调用模拟服务进行登录
    const response = await mockService.login(username, password);
    
    if (!response.success) {
      return createResponse(
        { success: false, error: response.error || '登录失败' },
        401
      );
    }
    
    // 返回登录成功信息和令牌
    return createResponse({
      success: true,
      data: response.data,
      message: '登录成功'
    });
  } catch (error) {
    console.error('[v0] 登录错误:', error);
    return createResponse(
      { success: false, error: '登录过程中发生错误' },
      500
    );
  }
}

// 获取用户信息接口
export async function GET(_request: NextRequest) {
  try {
    // 这里应该验证JWT令牌，在实际应用中
    // 目前仅返回模拟数据
    
    const mockUser = {
      id: '1',
      username: 'admin',
      role: 'admin',
      name: '系统管理员'
    };
    
    return createResponse({
      success: true,
      data: mockUser
    });
  } catch (error) {
    console.error('[v0] 获取用户信息错误:', error);
    return createResponse(
      { success: false, error: '获取用户信息失败' },
      500
    );
  }
}

// 登出接口
export async function DELETE(_request: NextRequest) {
  try {
    // 在实际应用中，这里应该使令牌失效或清除会话
    
    return createResponse({
      success: true,
      message: '登出成功'
    });
  } catch (error) {
    console.error('[v0] 登出错误:', error);
    return createResponse(
      { success: false, error: '登出过程中发生错误' },
      500
    );
  }
}

// 添加OPTIONS方法处理预检请求
export async function OPTIONS(_request: NextRequest) {
  return createResponse({});
}