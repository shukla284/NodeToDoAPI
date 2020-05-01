const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost:27017/ToDoApp';

mongoose.Promise = global.Promise;
mongoose.connect(dbURL);

var ToDoModel = mongoose.model('ToDo', {
  text: {type: String},
  completed: {type: Boolean},
  completedAt: {type: Number}
});

var newToDo = new ToDoModel({
  text: 'Create a new To Do',
  completed: false,
  completedAt: 730
});


newToDo.save().then((doc) => {
  console.log('Successfully added doc to collection', doc);
}, (error) => {
  console.log('Error while writing the document in collection', error);
});
