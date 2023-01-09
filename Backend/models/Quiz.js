const mongoose = require('mongoose');

const Quiz = new mongoose.Schema({
  quizID: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true,
  },
  totalQuestion: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "active"
  }
});

module.exports = mongoose.model('Quiz', Quiz, 'Quiz');
