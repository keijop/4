const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const { userExtractor } = require('../utils/middleware')
require('express-async-errors')

blogsRouter
  .route('/')
  .get(async (req, res) => {
    const bloglist = await Blog.find({}).populate('user', {
      name: 1,
      username: 1,
    })
    res.json(bloglist)
  })
  .post(userExtractor, async (req, res) => {
    const user = req.user
    const body = req.body
    body.user = user.id
    const newBlog = await Blog.create(body)

    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
    const newBlogPopulated = await Blog.findById(newBlog.id).populate('user', {
      name: 1,
      username: 1,
    })

    res.status(201).json(newBlogPopulated)
  })

blogsRouter
  .route('/:id')
  .delete(userExtractor, async (req, res) => {
    const blogToRemove = await Blog.findById(req.params.id)
    if (!blogToRemove) {
      return res
        .status(404)
        .json({ error: 'The resource to be deleted does not exist' })
    }

    if (req.user.id.toString() !== blogToRemove.user.toString()) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this resource' })
    }

    const removedBlog = await Blog.findByIdAndDelete(req.params.id)
    res.status(200).json(removedBlog)
  })
  .patch(async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes: req.body.likes },
      { new: true }
    )
    res.status(200).json(updatedBlog)
  })

blogsRouter
  .route('/:id/comments')
  .get(async (req, res) => {
    const blogId = req.params.id
    const comments = await Comment.find({ blogId })
    res.status(200).json({ comments })
  })
  .post(async (req, res) => {
    const blogId = req.params.id
    const { content } = req.body
    const comment = await Comment.create({ blogId, content })
    res.status(200).json({ comment })
  })

module.exports = blogsRouter
