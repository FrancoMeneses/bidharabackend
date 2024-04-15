import express, { json } from 'express'
import cors from 'cors'
import { productRouter } from './routes/product.js'
import { trayRouter } from './routes/tray.js'
import { userRouter } from './routes/user.js'

const app = express()

const PORT = process.env.PORT ?? 1222

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPETED_ORIGINS = [
      'http://localhost:5173'
    ]

    if (ACCEPETED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(json())
app.disable('x-powered-by')

app.use('/products', productRouter)
app.use('/trays', trayRouter)
app.use('/users', userRouter)

app.use('/', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} -> http://localhost:${PORT}`)
})
