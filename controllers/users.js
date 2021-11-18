const usersRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')

const bcrypt = require('bcrypt')

usersRouter.route('/')
  .get( async (req, res) => {
    const users = await User.find({}).populate('blogs', { title : 1, url : 1, author : 1 })
    res.status(200).json({ users })
  })
  .post( async (req, res) => {
    const { username, name, password , blogs } = req.body
    if(!password || password.length < 4){
      return res.status(400).json({ error : 'Validation failed. Password is required, minimum lenght 3 characters' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ username, name, hashedPassword, blogs })
    res.status(201).json(newUser)
  })



module.exports = usersRouter