const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nic: {
        type: String,
        required: [true, 'NIC is required']
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
    role: {
        type: String,
        required: [true, 'role is required']
    },
    vehicleType: {
        type: String,
        required: [true, 'vehicleType is required']
    }
})

const User = new mongoose.model('users', userSchema);

module.exports = User;