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
        type: String,
        required: [true, 'fuelArrivalTime is required']
    },
    fuelFinishedTime: {
        type: String
    },
    isPetrolAvailable: {
        type: Boolean,
        required: [true, 'isPetrolAvailable is required']
    },
    isDieselAvailable: {
        type: Boolean,
        required: [true, 'isDieselAvailable is required']
    },
    petrolCapacity: {
        type: Number,
        required: [true, 'capacity is required']
    },
    petrolAvailableAmount: {
        type: Number,
        min: 0,
        required: [true, 'availableAmount is required']
    },
    dieselCapacity: {
        type: Number,
        required: [true, 'capacity is required']
    },
    dieselAvailableAmount: {
        type: Number,
        min: 0,
        required: [true, 'availableAmount is required']
    },
    uom: {
        type: String,
        required: [true, 'uom is required']
    }
})

const Shed = new mongoose.model('sheds', shedSchema);

module.exports = Shed;