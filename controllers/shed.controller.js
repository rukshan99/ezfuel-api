const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../helpers/http.error');
const Shed = require('../schemas/shed.schema');

// Twilio messaging service related imports and configurations
const twilioAccountSid = process.env['TWILIO_ACCOUNT_SID'];
const twilioAuthToken = process.env['TWILIO_AUTH_TOKEN'];
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);


/*
* Controller to get all the sheds from the sheds collection in MongoDB
*/
const getAllSheds = async (req, res) => {
    await Shed.find()
        .then(data => {
            res.status(200).send({ data: data });
        })
        .catch(error => {
            res.status(500).send({ error: error.message });
        })
}

/*
* Controller to get a shed by its shedId from the sheds collection in MongoDB
*/
const getShedById = async (req, res) => {
    const shedId = req.params.shedId;

    Shed.findOne({ shedId })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Shed not found. Check ID: " + shedId });
            } else {
                res.status(200).send({ data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving shed with ID:" + shedId });
        });
}

/*
* Controller to create a shed and save in MongoDB
*/
const createShed = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    const { city, district, name, petrolCapacity, dieselCapacity } = req.body;
    const shedId = city + '-' + district + '-' + name.replace(/\s/g, '');
    const shed = await Shed.findOne({ shedId: shedId.toLowerCase() });
    if (!shed) {
        const newShed = new Shed({
            shedId: shedId.toLowerCase(),
            city,
            district,
            name,
            fuelArrivalTime: Date().toString(),
            fuelFinishedTime: '',
            isPetrolAvailable: true,
            isDieselAvailable: true,
            petrolCapacity,
            dieselCapacity,
            petrolAvailableAmount: petrolCapacity,
            dieselAvailableAmount: dieselCapacity,
            uom: "Litre"
        });
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await newShed.save({ session: session });
            await session.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Error occured while saving shed details. Please try again.',
                500
            );
            return next(error);
        }
        res.status(201).json({ shed: newShed });
    }
    else {
        res.status(200).json({ message: 'Shed already exists in the system. Please check again.' });
    }
    res.send("fail");
};

/*
* Controller to reduce fuel amounts in a shed
*/
const recordSale = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    var { shedId, fuelType, amount, uom } = req.body;
    var newShedDetails = {};
    var msgToAdmin = "";
    try {
        const shed = await Shed.findOne({ shedId });
        if (fuelType === "petrol") {
            if ((shed.petrolAvailableAmount - amount) < 2000 || shed.petrolAvailableAmount < amount) {
                // Checking remaining petrol amount and send admin an alert to purchase
                const remainingAmount = 0 ? (shed.petrolAvailableAmount - amount) < 0 : (shed.petrolAvailableAmount - amount);
                msgToAdmin = "Fuel type: Petrol is low/finished. Please make a purchase order. Remaining Petrol = " + remainingAmount;
                await Shed.findOneAndUpdate({ shedId }, {
                    isPetrolAvailable: false
                });
                // Sending text message to admin
                twilioClient.messages
                    .create({
                        body: '\n' + msgToAdmin,
                        from: '+16899994974',
                        to: '+94763754996'
                    })
                    .then(message => console.log(message.sid));
            }
            // Updating remaining fuel amounts
            if (shed.petrolAvailableAmount < amount) {
                amount = shed.petrolAvailableAmount;
            }
            newShedDetails = await Shed.findOneAndUpdate({ shedId }, {
                '$inc': {
                    petrolAvailableAmount: -amount
                }
            }, {
                new: true,
            });
        } else {
            if ((shed.dieselAvailableAmount - amount) < 2000 || shed.dieselAvailableAmount < amount) {
                // Checking remaining diesel amount and send admin an alert to purchase
                const remainingAmount = 0 ? (shed.dieselAvailableAmount - amount) < 0 : (shed.dieselAvailableAmount - amount);
                msgToAdmin = "Fuel type: Diesel is low/finished. Please make a purchase order. Remaining Diesel = " + remainingAmount;
                await Shed.findOneAndUpdate({ shedId }, {
                    isDieselAvailable: false
                });
                // Sending text message to admin
                twilioClient.messages
                    .create({
                        body: '\n' + msgToAdmin,
                        from: '+16899994974',
                        to: '+94763754996'
                    })
                    .then(message => console.log(message.sid));
            }
            // Updating remaining fuel amounts
            if (shed.petrolAvailableAmount < amount) amount = shed.petrolAvailableAmount;
            newShedDetails = await Shed.findOneAndUpdate({ shedId }, {
                '$inc': {
                    dieselAvailableAmount: -amount
                }
            }, {
                new: true,
            });
        }
        res.status(200).json({ newShedDetails });
    } catch (err) {
        res.status(500).send({ message: err });
    }

}

exports.getAllSheds = getAllSheds;
exports.getShedById = getShedById;
exports.createShed = createShed;
exports.recordSale = recordSale;