import app from './src/app'
import { connectDB } from './src/config/db'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001

connectDB().then(() => {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})