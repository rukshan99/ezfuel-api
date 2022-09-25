const mongoose = require('mongoose')

const shedSchema = new mongoose.Schema({
    shedId: {
        type: String,
        required: [true, 'shedId is required']
    },
    city: {
        type: String,
        required: [true, 'city is required']
    },
    district: {
        type: String,
        required: [true, 'district is required']
    },
    name: {
        type: String,
        required: [true, 'name is required']
    },
    fuelArrivalTime: {
        type: String
    },
    fuelFinishedTime: {
        type: String
    },
    isFuelAvailable: {
        type: Boolean
    },
    capacity: {
        type: Number
    },
    availableAmount: {
        type: Number
    }
})

const Shed = new mongoose.model('sheds', shedSchema);

module.exports = Shed;