const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const Router = require('./controllers/blogs')
const logger = require('./utils/logger')

// node throws an error if line starts with (
;(async () => {
  try {
    mongoose.connect(MONGODB_URI)
    logger.info('connected to mongoDB')
  } catch(e) {
    logger.error('error connecting to mongoDB: ', e.message)
  }
})()


app.use(cors())
app.use(express.json())
app.use('/api/blogs', Router)


module.exports = app
