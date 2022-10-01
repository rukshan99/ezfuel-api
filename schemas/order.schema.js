const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: [true, 'adminId is required']
    },
    shedId: {
        type: String,
        required: [true, 'shedId is required']
    },
    supplierId: {
        type: String,
        required: [true, 'supplierId is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    fuelType: {
        type: String,
        required: [true, 'fuelType is required']
    },
    uom: {
        type: String,
        required: [true, 'uom is required']
    },
    amount: {
        type: Number,
        required: [true, 'amount is required']
    }
})

const Order = new mongoose.model('orders', orderSchema);

module.exports = Order;