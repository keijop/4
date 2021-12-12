const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  blogId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
