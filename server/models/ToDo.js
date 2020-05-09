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
  _created: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports.ToDoModel = ToDoModel;
