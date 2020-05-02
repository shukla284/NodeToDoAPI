const mongoose = require('mongoose');

var ToDoModel = mongoose.model('ToDo', {
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
    required: false,
    trim: true,
    minlength: 1
  }
});

module.exports = {ToDoModel};
