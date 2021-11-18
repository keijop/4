const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
require('express-async-errors')

blogsRouter.route('/')
  .get( async (req, res) => {
    const bloglist = await Blog.find({}).populate('user', { name : 1, username : 1 })
    res.json(bloglist)
  })
  .post( userExtractor, async (req, res) => {
    const user = req.user
    const body = req.body
    body.user = user.id
    const newBlog = await Blog.create(body)

    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()

    res.status(201).json(newBlog)
  })

blogsRouter.route('/:id')
  .delete(userExtractor,  async (req, res) => {
    const blogToRemove = await Blog.findById(req.params.id)
    if(!blogToRemove){
      return res.status(404).json({ error : 'The resource to be deleted does not exist' })
    }

    console.log(req.user.id, typeof req.user.id.toString())
    console.log(blogToRemove.user, typeof blogToRemove.user.toString())
    if(req.user.id.toString() !== blogToRemove.user.toString()){
      return res.status(403).json({ error : 'You are not authorized to delete this resource' })
    }

    const removedBlog = await Blog.findByIdAndDelete(req.params.id)
    res.status(200).json(removedBlog)
  })
  .patch( async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes : req.body.likes },
      { new : true }
    )
    res.status(200).json(updatedBlog)
  })

module.exports = blogsRouter