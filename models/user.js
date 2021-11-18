const mongoose = require('mongoose')
//const uniqueValidator = require('mongoose-unique-validator')


const userSchema = mongoose.Schema({
  name : {
    type : String
  },
  username : {
    type : String,
    required : true,
    minlength : [3, 'Username can not be shorter that 3 characters'],
    unique : true
  },
  hashedPassword : {
    type : String,
    required : true
  },
  blogs : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.hashedPassword
  }
})

//userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User

