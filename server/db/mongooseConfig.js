// imports and database configuration
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        if (err)
           return console.log('Error while connecting ', err);
    }
);
