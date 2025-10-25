export const graphqlGatewayConfig = {
  endpoint: '/graphql',
  modules: ['hr', 'audit', 'ops', 'finance', 'promotion', 'risk'],
  authStrategy: 'JWT',
  introspection: true,
  tracing: true,
  federation: true
}
