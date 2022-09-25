const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const UserRoutes = require('./routes/user.routes');
const connectionString = process.env['MONGO_DB_CONNECTION_STRING'];

app = express();
port = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/v1/', UserRoutes);

mongoose
    .connect(connectionString)
    .then(() => {
        app.listen(port, () => {
            console.log('Server is listening on port ' + port + `\n http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.log(err);
    });