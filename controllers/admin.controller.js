const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../helpers/http.error');
const Time = require('../schemas/time.schema');
const Shed = require('../schemas/shed.schema');
const PurchaseOrder = require('../schemas/purchaseOrder.schema');

// Twilio messaging service related imports and configurations
const twilioAccountSid = process.env['TWILIO_ACCOUNT_SID'];
const twilioAuthToken = process.env['TWILIO_AUTH_TOKEN'];
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);

// Mailtrap email service related imports and configurations
const { MailtrapClient } = require("mailtrap");
const mailtrapToken = process.env['MAILTRAP_API_TOKEN'];
const mailtrapSenderMail = "peter@mailtrap.com";
const mailTrapClient = new MailtrapClient({ token: mailtrapToken });
const sender = { name: "ezFuel", email: mailtrapSenderMail };

/*
* Controller to get the count of waiting vehicles in a shed
*/
const getCountAllVehicles = async (req, res) => {
    const shedId = req.params.shedId;

    Time.count({ shedId, isInQueue: true })
        .then(data => {
            res.status(200).send({ countAllVehicles: data });
        })
        .catch(err => {
            res.status(500).send({ message: "Error getting count for shed with ID:" + shedId });
        });
}

/*
* Controller to get the remaining fuel amounts in a shed
*/
const getRemainingFuelAmounts = async (req, res) => {
    const shedId = req.params.shedId;

    Shed.findOne({ shedId }, 'dieselAvailableAmount petrolAvailableAmount')
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Shed not found. Check ID: " + shedId });
            } else {
                res.status(200).send({ fuelAmounts: data });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error getting fuel amounts for shed with ID:" + shedId });
        });
}

/*
* Controller to create a purchase order
*/
const createPurchaseOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    const { adminId, shedId, supplierId, email, mobile, fuelType, amount } = req.body;
    const orderDate = Date().toString();
    const orderId = 'ord_' + adminId + '_' + orderDate.replace(/\s/g, '')
    const purchaseOrder = await PurchaseOrder.findOne({ orderId });
    if (!purchaseOrder) {
        const newPurchaseOrder = new PurchaseOrder({
            orderId,
            adminId,
            shedId,
            supplierId,
            email,
            mobile,
            fuelType,
            uom: 'Litre',
            amount,
            orderDate
        });
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await newPurchaseOrder.save({ session: session });
            await session.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Error occured while saving purchase order details. Please try again.',
                500
            );
            return next(error);
        }

        // Sending a text message to the supplier to notify about the created purchase order
        twilioClient.messages
            .create({
                body: shedId + 'has sent a purchase order through ezFuel. Please check the email '
                    + email + '. Purchase order summary: Fuel type = ' + fuelType
                    + ' UoM = ' + uom
                    + 'Amount = ' + amount,
                from: '+16899994974',
                to: mobile
            })
            .then(message => console.log(message.sid));
        
        // Sending an e-mail to the supplier regarding the purchase order and details
        mailTrapClient
            .send({
                from: sender,
                to: [{ email }],
                subject: 'Purchase Order: ' + orderId,
                text: JSON.stringify(newPurchaseOrder.toObject()),
            })
            .then(console.log, console.error);

        res.status(201).json({ purchaseOrder: newPurchaseOrder });
    }
    else {
        res.status(200).json({ message: 'Purchase order already exists in the system. Please check again.' });
    }
    res.send("fail");
};

exports.getCountAllVehicles = getCountAllVehicles;
exports.getRemainingFuelAmounts = getRemainingFuelAmounts;
exports.createPurchaseOrder = createPurchaseOrder;