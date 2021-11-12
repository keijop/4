const Router = require('express').Router()
const Blog = require('../models/blog')

Router.route('/')
    .get( (request, response) => {
         Blog
            .find({})
            .then(blogs => {
            response.json(blogs)
            })
    })
    .post( (request, response) => {
        const blog = new Blog(request.body)

        blog
          .save()
         .then(result => {
        response.status(201).json(result)
        })
    })




module.exports = Router