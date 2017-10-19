// @flow

import createTestServer from '../createTestServer'

describe('post', () => {
  let server
  let accessToken

  beforeAll(async () => {
    server = await createTestServer()

    await server.register()
    const loginResponse = await server.login()
    accessToken = loginResponse.body.jwt
  })

  afterAll(async () => {
    await server.destroy()
  })

  test('create post', async () => {
    const post = {
      title: 'Hello World',
      body: 'Welcome to my blog.',
    }

    const response = await server.request()
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(post)

    expect(response.status).toEqual(201)
  })

  test('throw 400 when submitting empty post', async () => {
    const post = {}
    const response = await server.request()
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(post)

    expect(response.status).toEqual(400)
  })

  test('throw 401 when submitting unauthorized post', async () => {
    const post = {
      title: 'Hello World',
      body: 'Welcome to my blog.',
    }

    const response = await server.request()
      .post('/posts')
      .send(post)

    expect(response.status).toEqual(401)
  })

  test('fetch post', async () => {
    const post = {
      title: 'Hello World',
      body: 'Welcome to my blog.',
    }

    const createResponse = await server.request()
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(post)

    const getResponse = await server.request().get(`/posts/${createResponse.body._id}`)

    expect(getResponse.status).toEqual(200)
    expect(getResponse.body.title).toEqual('Hello World')
  })

  test('throw 404 when fetching nonexistent post', async () => {
    const response = await server.request().get('/posts/foobar')

    expect(response.status).toEqual(404)
  })
})
