import { randomUUID } from 'node:crypto'
import QRCode from 'qrcode'
import { readJSON } from '../../utils.js'
const products = readJSON('./products.json')

const URL_PREFIX = 'http://localhost:1222/products/'

export async function getAll () {
  return products
}

export async function getOne ({ id }) {
  const isProduct = products.find(product => product.id === id)
  if (isProduct) {
    return isProduct
  } else {
    return undefined
  }
}

export async function createOne ({ data }) {
  let res = {
    success: false,
    message: ''
  }
  const newProduct = {
    id: randomUUID(),
    ...data
  }
  QRCode.toFile(`./tmp/${newProduct.id}.png`, `${URL_PREFIX}${newProduct.id}`, function (err) {
    if (err) throw err
    console.log(`QR Code from ${newProduct.id} created`)
  })
  products.push(newProduct)
  res = {
    success: true,
    message: newProduct
  }
  return res
}

export async function editOne ({ id, body }) {
  let res = {
    success: false,
    message: ''
  }
  const productIndex = products.findIndex(product => product.id === id)
  if (productIndex === -1) {
    res = {
      message: 'Product not found',
      ...res
    }
    return res
  }
  for (const prop in body) {
    products[productIndex][prop] = body[prop]
  }
  res = {
    success: true,
    message: products[productIndex]
  }
  return res
}

export async function deleteOne ({ id }) {
  let res = {
    success: false,
    message: ''
  }
  const productIndex = products.findIndex(product => product.id === id)
  if (productIndex === -1) {
    res = {
      ...res,
      message: 'Product not found'
    }
    return res
  }
  products.splice(productIndex, 1)
  res = {
    success: true,
    message: 'Product deleted'
  }
  return res
}
