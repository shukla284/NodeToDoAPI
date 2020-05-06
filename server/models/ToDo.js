const mongoose = require('mongoose');

var ToDoModel = mongoose.model('ToDoApp', {
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
    type: Number,
    default: null
  },
  createdAt: {
    type: Number,
    default: null
  },
  user: {
    type: String,
    required: false,
    trim: true,
    minlength: 1
  }
});

module.exports.ToDoModel = ToDoModel;
