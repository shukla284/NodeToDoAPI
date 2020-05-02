const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost:27017/ToDoAppAgain';

mongoose.Promise = global.Promise;
mongoose.connect(dbURL);

var ToDoModel = mongoose.model('ToDoNotes', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false,

  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

var userModel = mongoose.model('UserDetails',{
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

var newUser = new userModel({
  username: 'Kabir Singh',
  email: '   kabirsingh@gmail.com '
});

newUser.save().then((doc) => {
  console.log('Successfully added the doc to collection', doc);
  mongoose.disconnect();
}, (error) => {
  console.log('Error while adding the doc to collections ', error);
  mongoose.disconnect();
});

// to do collection addition of records

// var todo = new ToDoModel({
//   name: 'Create a new to do',
//   completed: false,
//   user: 'Kabir Singh'
// });
//
// todo.save().then((doc) => {
//   console.log('Successfully written the doc ', doc);
//   mongoose.disconnect();
// }, (error) => {
//   console.log('Error while writing the record', error);
//   mongoose.disconnect();
// });
