const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nic: {
    type: String,
    required: [true, 'Username is required']
  },
  firstName: {
    type: String,
    required: [true, 'firstName is required']
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required']
  },
  password: {
    type: String,
    required: [true, 'Passowrd is required']
  },
  vehicleType: {
    type: String,
    required: [true, 'vehicleType is required']
  }
})

const Register = new mongoose.model('users', userSchema);

module.exports = Register;