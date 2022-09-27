const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../helpers/http.error');
const Time = require('../schemas/time.schema');

/*
* Controller to get the count of waiting vehicles in a shed
*/
const getCountAllVehicles = async (req, res) => {
    const shedId = req.params.shedId;

    Time.count({ shedId, isInQueue: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Shed not found. Check ID: " + shedId });
            } else {
                res.status(200).send({ countAllVehicles: data });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error getting count for shed with ID:" + shedId });
        });
}

exports.getCountAllVehicles = getCountAllVehicles;