// imports and database configuration
const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost:27017/ToDoApp';

mongoose.Promise = global.Promise;

// connection being initiated
mongoose.connect(dbURL);
