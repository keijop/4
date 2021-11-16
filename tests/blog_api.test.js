const  mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

//console.log(mongoose.connection.readyState)

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }]

const oneBlog =  {
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12
}

const blogWithoutLikes = {
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
}

beforeEach( async () => {
  await Blog.deleteMany({})
  await Blog.create(initialBlogs)
})

describe('bloglist', () => {

  test('all blogs are returned and as json', async () => {
    const response = await api.get('/api/blogs')
    expect.stringMatching(response.header['content-type'], /json/)
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('post blog returns add blog to db and return added blog ', async () => {
    const postResponse = await api
      .post('/api/blogs')
      .send(oneBlog)
    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
    expect(postResponse.body.title).toBe('Canonical string reduction')
  })

  test('blog like property defaults to 0 if not specified', async () => {
    const response = await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
    expect(response.body.likes).toBe(0)
  })

  test('post blog without url and/or title will return statuscode 400', async () => {
    const blogs = [
      { title : 'Some titel' },
      { url : 'Some url' },
      {}
    ]

    for(const blog of blogs){
      const response = await api
        .post('/api/blogs')
        .send(blog)
      expect(response.statusCode).toBe(400)

    }
  })

  test('delete single post returns deleted post and removes from db', async () => {
    const id = '5a422a851b54a676234d17f7'
    const deleteResponse = await api.delete('/api/blogs/'+id)
    const getResponse = await api.get('/api/blogs')
    expect(deleteResponse.body.id).toBe(id)
    expect(getResponse.body).toHaveLength(initialBlogs.length - 1)
  })

  test('update single blog returns updated blog from db', async () => {
    const id = '5a422a851b54a676234d17f7'
    const response = await api
      .patch('/api/blogs/'+id)
      .send({ likes : 99 }, { new :true })
    expect(response.body.likes).toBe(99)

  })



})


afterAll( async () => {
  //console.log(mongoose.connection.readyState)
  await mongoose.connection.close()
  //console.log(mongoose.connection.readyState)
})



