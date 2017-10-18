// @flow

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ms from 'ms'

import type {DbUser} from '$db/models/User'
import type {AccessToken} from './types'

export const validatePassword = async (password1: string, password2: string) => {
  const isCorrect = await bcrypt.compare(password1, password2)

  if (!isCorrect) {
    throw new Error('INCORRECT_PASSWORD')
  }
}

export const generateAccessToken = async (user: DbUser): Promise<string> => {
  const tokenData: AccessToken = {
    user,
    refresh: user.password,
    expires: +new Date() + ms('1 day'),
  }

  return await jwt.sign(tokenData, process.env.JWT_SECRET)
}

export const verifyAccessToken = async (accessToken: string): Promise<?AccessToken> => {
  try {
    const tokenData = await jwt.verify(accessToken, process.env.JWT_SECRET)

    if (tokenData.expires < +new Date()) {
      throw new Error('EXPIRED_ACCESS_TOKEN')
    }
  } catch (e) {
    throw e
  }
}
