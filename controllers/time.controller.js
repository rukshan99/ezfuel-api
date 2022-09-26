const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../helpers/http.error');
const Time = require('../schemas/time.schema');

/*
* Controller to record arrival time of a customer to a shed
*/
const updateArrivalTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    const { userId, shedId } = req.body;
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const log = await Time.findOneAndUpdate(
            {
                nic: userId,
                shedId: shedId
            },
            {
                arrivalTime: Date().toString(),
                departureTime: '',
                isInQueue: true
            },
            {
                new: true,
                upsert: true
            }
        );
        await session.commitTransaction();
        res.status(201).json({ data: log });
    } catch (err) {
        const error = new HttpError(
            'Error occured while logging details. Please try again.',
            500
        );
        return next(error);
    }
    res.send("fail");
};

/*
* Controller to record departure time of a customer to a shed
*/
const updateDepartureTime = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    const { userId, shedId } = req.body;
    const timeLog = await Time.findOne({ nic: userId, shedId: shedId });
    if(!timeLog) {
        const error = new HttpError(
            'Invalid credentials.',
            404
        );
        return next(error);
    }
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const log = await Time.findOneAndUpdate(
            {
                nic: userId,
                shedId: shedId
            },
            {
                departureTime: Date().toString(),
                isInQueue: false
            },
            {
                new: true
            }
        );
        await session.commitTransaction();
        res.status(201).json({ data: log });
    } catch (err) {
        const error = new HttpError(
            'Error occured while logging details. Please try again.',
            500
        );
        return next(error);
    }
    res.send("fail");
};


exports.updateArrivalTime = updateArrivalTime;
exports.updateDepartureTime = updateDepartureTime;