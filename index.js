const app = require('./app')
const http = require('http')
const { PORT } = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

if(process.env.NODE_ENV !== 'test'){
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}...`)
  })
}

module.exports = server