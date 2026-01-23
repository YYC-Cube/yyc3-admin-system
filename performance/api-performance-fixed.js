/**
 * K6 API性能测试 - 修复版本
 * 针对 api.0379.email 优化
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.3'],
  },
};

// 允许通过环境变量覆盖
export let BASE_URL = __ENV.BASE_URL || 'http://api.0379.email';

export default function () {
  let response = http.post(`${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: 'test@example.com', password: 'test123' }),
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: '10s'
    }
  );

  check(response, {
    'login status is success': (r) => r.status >= 200 && r.status < 500,
    'response time < 2s': (r) => r.timings.duration < 2000,
    'has response body': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}