const mongoose = require('mongoose')

const purchaseOrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: [true, 'orderId is required']
    },
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
    mobile: {
        type: String,
        required: [true, 'mobile is required']
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

const PurchaseOrder = new mongoose.model('purchaseOrders', purchaseOrderSchema);

module.exports = PurchaseOrder;