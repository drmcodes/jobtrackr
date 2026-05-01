import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGO_URI no definida en las variables de entorno')
  }

  await mongoose.connect(uri)
  console.log('✅ MongoDB conectado')
}