const mongoose = require('mongoose');

const Admin = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tel: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default:"active"
  }
});

module.exports = mongoose.model('Admin', Admin, 'Admins');
