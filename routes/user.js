import { Router } from 'express'
import * as userController from '../controllers/user.js'

export const userRouter = Router()

userRouter.post('/validate', userController.getOneByName)
