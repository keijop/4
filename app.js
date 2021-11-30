const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const {
  errorHandler,
  notFoundEndpoint,
  requestLogger,
} = require('./utils/middleware')

//node throws an error if line starts with (
;(async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    logger.info('connected to mongoDB')
  } catch (e) {
    logger.error('error connecting to mongoDB: ', e.message)
  }
})()

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const resetRouter = require('./controllers/reset')
  app.use('/api/testing', resetRouter)
}

app.use(notFoundEndpoint)
app.use(errorHandler)

module.exports = app
