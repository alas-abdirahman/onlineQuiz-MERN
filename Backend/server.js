const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// TODO: Routes
const Quiz = require('./routes/Quiz');
const Student = require('./routes/Student');
const Admin = require('./routes/Admin');
const Question = require('./routes/Question');

const app = express();

// TODO: some configuration
app.use(express.json());
app.use(cors());
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// TODO: connect to the mongoDB Provider
mongoose.connect('mongodb+srv://alas:212320Alas@archivescloud.aa6x22o.mongodb.net/?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
// TODO: Check the API
app.get('/', (req, res) => {
  res.send({ status: 'API Working !!!' });
});

// TODO: Routes in here
app.use('/api/admins', Admin);
app.use('/api/quizes', Quiz);
app.use('/api/students', Student);
app.use('/api/questions', Question);

// TODO: server PORT Listening
app.listen(5000, () => {
  console.log(`The Server is running on PORT ${5000}`);
});
