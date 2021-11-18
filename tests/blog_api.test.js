const  mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }]

const oneBlog =  {
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12
}

const blogWithoutLikes = {
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
}
const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthbGV2IiwiaWQiOiI2MTk2YWI5M2IwZDkxM2JlNWNhMmMxZDgiLCJpYXQiOjE2MzcyNjQzNTh9.Nn1mVPUtCuhLHcWSg6-KbAX9JRowb36J_Fkm6HqA7bI'

beforeEach( async () => {
  await Blog.deleteMany({})
  await Blog.create(initialBlogs)
})

describe('bloglist', () => {

  test('post request without valid token responds 401', async () => {
    const response = await api
      .post('/api/blogs')
      .send(oneBlog)
    expect(response.statusCode).toBe(401)
  })

  test('all blogs are returned and as json', async () => {
    const response = await api.get('/api/blogs')
    expect.stringMatching(response.header['content-type'], /json/)
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('post blog returns add blog to db and return added blog', async () => {
    const postResponse = await api
      .post('/api/blogs')
      .send(oneBlog)
      .set({ 'Authorization' : token })
    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body).toHaveLength(initialBlogs.length + 1)
    expect(postResponse.body.title).toBe('Canonical string reduction')
  })

  test('blog like property defaults to 0 if not specified', async () => {
    const response = await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .set({ 'Authorization' : token })
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
        .set({ 'Authorization' : token })
      expect(response.statusCode).toBe(400)
    }
  })

  test('delete single post returns deleted post and removes from db', async () => {

    const blogToRemove = await api
      .post('/api/blogs')
      .send(oneBlog)
      .set({ 'Authorization' : token })

    const id = blogToRemove.body.id
    const deleteResponse = await api
      .delete('/api/blogs/'+id)
      .set({ 'Authorization' : token })

    const getResponse = await api.get('/api/blogs')
    expect(deleteResponse.body.id).toBe(id)
    expect(getResponse.body).toHaveLength(initialBlogs.length)
  })

  test('update single blog returns updated blog from db', async () => {

    const blogToUpdate = await api
      .post('/api/blogs')
      .send(oneBlog)
      .set({ 'Authorization' : token })

    const id = blogToUpdate.body.id
    const updateResponse = await api
      .patch('/api/blogs/'+id)
      .send({ likes : 99 }, { new :true })
    expect(updateResponse.body.likes).toBe(99)

  })



})


afterAll( async () => {
  await mongoose.connection.close()
})



