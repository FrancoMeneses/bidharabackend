import { Router } from 'express'
import * as trayController from '../controllers/tray.js'

export const trayRouter = Router()

trayRouter.get('/', trayController.getAll)
trayRouter.get('/:id', trayController.getOne)
trayRouter.post('/', trayController.createOne)
trayRouter.patch('/:id', trayController.editOne)
trayRouter.delete('/:id', trayController.deleteOne)
