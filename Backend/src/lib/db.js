
const { connect } = require('mongoose')

const connectDB = async () => {
    try{
        await connect(process.env.MONGO_URL)
        console.log(`MongoDB Connected: ${process.env.MONGO_URL}`)
    }
    catch(error){
        console.log(`MongoDB connection error`, error)
    }
}

module.exports = connectDB