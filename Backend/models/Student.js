const mongoose = require('mongoose');

const Student = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true,
  },
  tel: {
    type: Number,
    required: true,
    unique: true
  },
  Class: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Student', Student, 'Students');
