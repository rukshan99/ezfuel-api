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

// Mailtrap SMTP service and Nodemailer related imports and configurations
const nodemailer = require('nodemailer');
let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'ddca7a9c425ee2',
        pass: 'c8d2cdcd9cd294'
    }
});

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
                body: '\r\n' + shedId + ' has sent a purchase order through ezFuel. Please check the email: '
                    + email + '\r\nPurchase order summary:\r\nFuel type = ' + fuelType
                    + '\r\nUoM = Litre'
                    + '\r\nAmount = ' + amount,
                from: '+16899994974',
                to: mobile
            })
            .then(message => console.log(message.sid));

        // Sending an e-mail to the supplier regarding the purchase order and details
        const emailObj = {
            from: 'admin@ezfuel.lk',
            to: email,
            subject: 'Purchase Order: ' + orderId,
            text: JSON.stringify(newPurchaseOrder.toObject())
        };
        transport.sendMail(emailObj, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });

        res.status(201).json({ purchaseOrder: newPurchaseOrder });
    }
    else {
        res.status(200).json({ message: 'Purchase order already exists in the system. Please check again.' });
    }
    res.send("fail");
};

/*
* Controller to receive fuel amounts to a shed
*/
const receiveFuel = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    const { shedId, dieselAmount, petrolAmount } = req.body;
    try {
        Shed.findOne({ shedId }, 'dieselCapacity dieselAvailableAmount petrolCapacity petrolAvailableAmount')
            .then(async capacityDetails => {
                if (!capacityDetails) {
                    res.status(404).send({ message: "Shed not found. Check ID: " + shedId });
                } else {
                    if (capacityDetails.dieselCapacity < (capacityDetails.dieselAvailableAmount + dieselAmount) ||
                        capacityDetails.petrolCapacity < (capacityDetails.petrolAvailableAmount + petrolAmount)) {
                        res.status(200).send({ message: "Can not receive more fuel. Shed capacities full." });
                    } else {
                        const session = await mongoose.startSession();
                        session.startTransaction();
                        const log = await Shed.findOneAndUpdate(
                            {
                                shedId: shedId
                            },
                            {
                                '$inc': {
                                    dieselAvailableAmount: dieselAmount || 0,
                                    petrolAvailableAmount: petrolAmount || 0
                                }
                            },
                            {
                                new: true
                            }
                        );
                        await session.commitTransaction();
                        res.status(201).json({ data: log });
                    }
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error getting fuel amounts for shed with ID:" + shedId });
            });
    } catch (err) {
        const error = new HttpError(
            'Error occured while logging details. Please try again.',
            500
        );
        return next(error);
    }
}

exports.getCountAllVehicles = getCountAllVehicles;
exports.getRemainingFuelAmounts = getRemainingFuelAmounts;
exports.createPurchaseOrder = createPurchaseOrder;
exports.receiveFuel = receiveFuel;