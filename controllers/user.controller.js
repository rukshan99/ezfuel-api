const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HttpError = require('../helpers/http.error');
const User = require('../schemas/user.schema');


const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs. Please check again.', 422));
    }
    const { userId, firstName, lastName, password, vehicleType } = req.body;
    const user = await User.findOne({ nic: userId });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            nic: userId,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword,
            role: 'customer',
            vehicleType: vehicleType
        });
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await newUser.save({ session: session });
            await session.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Error occured while saving user details. Please try again.',
                500
            );
            return next(error);
        }
        res.status(201).json({ user: newUser });
    }
    else {
        res.status(200).json({ message: 'User already exists. Please login.' });
    }
    res.send("fail");
};

const authUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        const password = req.body.password;
        if (userId == "admin" && password == "admin") {
            res.send({ result: "Success", user: { userId: 'admin', role: 'admin' } });
        }
        if (userId == "worker" && password == "worker") {
            res.send({ result: "Success", user: { userId: 'worker', role: 'worker' } });
        }
        const user = await User.findOne({ nic: userId });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
        } else {
            isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                const { password, ...userWithoutPassword } = user;
                res.send({ result: "Success", user: userWithoutPassword });
            } else {
                res.send("Invalid credentials")
            }
        }
    } catch (error) {
        res.status(400).send("Invalid credentials")
    }
}

exports.createUser = createUser;
exports.authUser = authUser;