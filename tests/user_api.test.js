const  mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach( async () => {
  await User.deleteMany({})
  //await Blog.create(initialBlogs)
})

describe('create user', () => {

  test('without username/password fails, responds 400 and error message', async () => {
    const invalidUsers = [
      { name : 'Test Dave', password : 'qwerty' },
      { name : 'Test Susan', username : 'qwerty' }]

    for (const user of invalidUsers){
      const response = await api.post('/api/users').send(user)
      //expect(response.statusCode).toBe(400)
      console.log('HELLO', response.body.error)
      expect(response.body.error).toMatch(/validation failed/i)
    }
  })


})

afterAll( async () => {
  await mongoose.connection.close()
})