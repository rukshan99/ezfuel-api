const mongoose = require('mongoose')

const timeSchema = new mongoose.Schema({
    nic: {
        type: String,
        required: [true, 'NIC is required']
    },
    arrivalTime: {
        type: String,
        required: [true, 'arrivalTime is required']
    },
    departureTime: {
        type: String
    },
    isInQueue: {
        type: Boolean,
        required: [true, 'rowVersion is required']
    },
    shedId: {
        type: String,
        required: [true, 'shedId is required']
    }
})

const Time = new mongoose.model('times', timeSchema);

module.exports = Time;