import mongoose from 'mongoose'

const connectDB= async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
        console.log(`\n MongoDB connected!! DB Host: ${connectionInstance.connection.host} `)
    }
    catch (error) {
        console.log('MonogDB connection error', error)
        process.exit(1)
    }
}

export default connectDB