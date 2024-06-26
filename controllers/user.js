import * as userModel from '../models/postgres/userModel.js'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

export async function getOneByName (req, res) {
  const body = req.body
  const response = await userModel.getOneByName({ body })

  if (!response.success) return res.status(404).json(response)

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    name: response.message.user_name,
    lastname: response.message.user_lastname,
    createdat: response.message.user_createdat,
    id: response.message.user_id,
    email: response.message.user_email,
    role: response.message.role_id
  }, 'secret')

  const serialized = serialize('userToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: '/'
  })

  res.setHeader('Set-Cookie', serialized)

  return res.status(200).json(response)
}

export async function logout (req, res) {
  try {
    console.log(req.cookies)
    const { userToken } = req.cookies

    if (!userToken) {
      return res.status(401).json({ error: 'There is not token' })
    }
    jwt.verify(userToken, 'secret')

    const serialized = serialize('userToken', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 0,
      path: '/'
    })
    res.setHeader('Set-Cookie', serialized)
    res.status(200).json('Login succesfully')
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}
