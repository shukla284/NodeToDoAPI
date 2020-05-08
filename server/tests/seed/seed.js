const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDoModel} = require('./../../models/ToDo.js');
const {UserModel} = require('./../../models/Users.js');


const todos = [
  {_id: new ObjectID(), name: 'First Test ToDo', completed: false, completedAt: 121133},
  {_id: new ObjectID(), name: 'Second Test ToDo', completed: false, completedAt: 1233}
];

var userOneID = new ObjectID();
var userTwoID = new ObjectID();
const users = [{
  _id: userOneID,
  email: 'userOne@gmail.com',
  password: 'userOnePassword',
  tokens: [{auth: 'auth', token: jwt.sign({_id: userOneID, auth: 'auth'}, 'qweerty874398349').toString()}]
}, {
  _id: userTwoID,
  email: 'userTwo@gmail.com',
  password: 'userTwoPassword',
}];

const populateTodos = (done) => {
  ToDoModel.deleteMany().then(() => {
    return ToDoModel.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  UserModel.deleteMany().then(() => {
    var userOne = new UserModel(users[0]).save();
    var userTwo = new UserModel(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
