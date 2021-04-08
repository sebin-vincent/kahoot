const mongoose = require('mongoose');
const config = require('config');

module.exports.initialize = () => {
    const env = process.env.NODE_ENV;
    console.log(`Initialising db in ${env} environment`);

    let db = config.get('db');

    mongoose.connect(db,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Connected to mongodb'));
}