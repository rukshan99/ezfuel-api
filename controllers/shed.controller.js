const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../helpers/http.error');
const Shed = require('../schemas/shed.schema');

const getAllSheds = async (req, res) => {
    await Shed.find()
    .then(data => {
        res.status(200).send({ data: data});
    })
    .catch(error => {
        res.status(500).send({ error: error.message});
    })
}

const createShed = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    const { city, district, name, capacity } = req.body;
    const shedId = city + '-' + district + '-' + name.replace(/\s/g, '');
    const shed = await Shed.findOne({ shedId: shedId.toLowerCase() });
    if (!shed) {
        const newShed = new Shed({
            shedId: shedId.toLowerCase(),
            city,
            district,
            name,
            fuelArrivalTime: Date.now().toString(),
            fuelFinishedTime: '',
            isFuelAvailable: true,
            capacity,
            availableAmount: capacity
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

exports.getAllSheds = getAllSheds;
exports.createShed = createShed;