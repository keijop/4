const loginRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.route('/').post( async (req, res) => {
  const { password, username } = req.body
  const user = await User.findOne({ username : username })
  const passwordCorrect = !user ? false : bcrypt.compare(password, user.hashedPassword)

  if(!passwordCorrect){
    return res.status(401).json({ error : 'Invalid username or password' })
  }

  const userToSerialize = {
    username : user.username,
    id : user._id
  }

  const token = jwt.sign(userToSerialize, process.env.SECRET)

  res.status(200).json({ token, username: user.username, name: user.name })

})

module.exports = loginRouter