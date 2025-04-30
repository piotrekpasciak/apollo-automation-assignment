import { test, expect } from '@playwright/test'
import users from '../../../fixtures/users.json'

test.describe('Reqres API GET api/users endpoint', () => {
  test('returns a list of users', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users?page=2', { headers: { 'x-api-key': process.env.REQRES_API_KEY }})
    
    expect(response.status()).toBe(200)

    const body = await response.json()
  
    const responseUsersWithoutAvatar = body.data.map(({ id, email, first_name, last_name }) => ({ id, email, first_name, last_name }))
    expect(responseUsersWithoutAvatar).toEqual(users)
  })
})
