const Router = require('express').Router()
const Blog = require('../models/blog')

Router.route('/')
  .get( async (request, response) => {
    const bloglist = await Blog.find({})
    response.json(bloglist)
  })
  .post( async (request, response) => {
    const { url, title } = request.body
    if(!url || !title){
      return response.sendStatus(400)
    }
    const blog = await Blog.create(request.body)
    response.status(201).json(blog)
  })

Router.route('/:id')
  .delete( async (request, response) => {
    const removedBlog = await Blog.findByIdAndDelete(request.params.id)
    response.status(200).json(removedBlog)
  })
  .patch( async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes : request.body.likes },
      { new : true }
    )
    response.status(200).json(updatedBlog)
  })




module.exports = Router