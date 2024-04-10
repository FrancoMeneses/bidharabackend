import * as trayModel from '../models/postgres/trayModel.js'
import { validatePartialTray, validateTray } from '../schemas/tray.js'

export async function getAll (req, res) {
  const all = await trayModel.getAll()
  res.status(200).send(all)
}

export async function getOne (req, res) {
  const { id } = req.params
  const response = await trayModel.getOne({ id })

  if (!response.success) return res.status(404).json({ message: response.message })

  res.status(200).send(response.message)
}

export async function createOne (req, res) {
  const body = req.body
  console.log(req.body)
  const result = validateTray(body)

  if (!result.success) return res.status(422).json({ error: result.error })

  const { data } = result
  const response = await trayModel.createOne({ data })

  if (!response.success) return res.status(422).json({ error: response.message })

  res.status(200).send(response.message)
}

export async function editOne (req, res) {
  const body = req.body
  const { id } = req.params

  const result = validatePartialTray(body)

  if (!result.success) return res.status(422).json({ error: result.error })

  const { data } = result
  const response = await trayModel.editOne({ id }, data)

  if (!response.success) return res.status(404).json({ message: response.message })

  res.status(200).json({ message: 'Tray has been updated successfully' })
}

export async function deleteOne (req, res) {
  const { id } = req.params

  const response = await trayModel.deleteOne({ id })

  if (!response.success) return res.status(422).json({ message: response.message })

  res.status(200).json({ message: 'Tray has been deleted succesfully' })
}
