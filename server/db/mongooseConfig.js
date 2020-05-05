// imports and database configuration
const mongoose = require('mongoose');
const dbURL = (process.env.MONGODB_URI)  || ('mongodb://localhost:27017/ToDoApp');

mongoose.Promise = global.Promise;

// connection being initiated
//mongoose.connect(dbURL);

mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        if (err)
           return console.log('Error while connecting ', err);
        console.log('Successful connection');
    }
);
