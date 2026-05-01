import app from './src/app'
import { connectDB } from './src/config/db'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
})