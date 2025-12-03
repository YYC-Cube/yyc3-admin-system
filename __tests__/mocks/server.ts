import { http } from 'msw'

// Import手动创建setupServer (绕过msw/node导入问题)
const { setupServer } = require('../../node_modules/msw/lib/node/index.js')
const { handlers } = require('./handlers')

/**
 * MSW Server for Node.js (Jest) environment
 */
export const server = setupServer(...handlers)
