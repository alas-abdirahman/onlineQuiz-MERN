const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const Question = new mongoose.Schema({
  quizID: {
    ref: "Quiz",
    type: Schema.Types.ObjectId,
  },
  question: {
    type: String,
    required: true,
  },
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
  option4: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Question', Question, 'Questions');
