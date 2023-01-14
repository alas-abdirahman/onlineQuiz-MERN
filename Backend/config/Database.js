// db.js
const Mongoose = require("mongoose")
const mongoURL = 'your atlas url'
const connectDB = async () => {
  await Mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB
