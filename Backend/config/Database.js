// db.js
const Mongoose = require("mongoose")
const mongoURL = 'mongodb+srv://alas:212320Alas@archivescloud.aa6x22o.mongodb.net/?retryWrites=true&w=majority'
const connectDB = async () => {
  await Mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB