export const apiMap = {
  incentive: {
    apply: { method: 'POST', path: '/incentive/apply', module: 'M7.4 奖惩系统' }
  },
  org: {
    structure: { method: 'GET', path: '/org/structure', module: 'M7.6 内部沟通系统' }
  },
  audit: {
    verify: { method: 'PUT', path: '/audit/verify', module: '审计链系统' }
  },
  graphql: {
    gateway: { method: 'POST', path: '/graphql', module: '六大核心模块统一网关' }
  }
}
