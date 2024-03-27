import { Router } from 'express'
import * as productController from '../controllers/product.js'

export const productRouter = Router()

productRouter.get('/', productController.getAll)

productRouter.get('/:id', productController.getOne)

productRouter.post('/', productController.createOne)

productRouter.patch('/:id', productController.editOne)

productRouter.delete('/:id', productController.deleteOne)
