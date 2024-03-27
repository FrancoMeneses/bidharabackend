import * as productModel from '../models/local_file/productModel.js'
import { validatePartialProduct, validateProduct } from '../schemas/product.js'

export async function getAll (req, res) {
  const all = await productModel.getAll()
  res.status(200).send(all)
}

export async function getOne (req, res) {
  const { id } = req.params
  const product = await productModel.getOne({ id })

  product ? res.status(200).send(product) : res.status(404).json({ response: 'product not found' })
}

export async function createOne (req, res) {
  const { body } = req
  const result = validateProduct(body)

  if (!result.success) return res.status(422).json({ error: result.error })

  const { data } = result
  const response = await productModel.createOne({ data })

  return res.status(201).json(response.message)
}

export async function editOne (req, res) {
  const body = req.body
  const result = validatePartialProduct(body)

  if (!result.success) return res.status(422).json({ error: result.error })

  const { id } = req.params
  const response = await productModel.editOne({ id, body })

  if (!response.success) return res.status(404).json(response.message)

  return res.status(201).json(response.message)
}

export async function deleteOne (req, res) {
  const { id } = req.params
  const response = await productModel.deleteOne({ id })

  if (!response.success) return res.status(404).json(response.message)

  res.status(200).json(res.message)
}
