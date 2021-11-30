const loginRouter = require('express').Router()

const User = require('../models/user')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.route('/').post(async (req, res) => {
  const { password, username } = req.body
  console.log('trying to log in....')
  console.log(password, username)
  console.log(`------`)
  if (!password || !username)
    return res.status(400).json({ error: 'Missing credentials' })
  const user = await User.findOne({ username: username })

  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(password, user.hashedPassword)

  if (!passwordCorrect) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const userToSerialize = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userToSerialize, process.env.SECRET)

  res.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
