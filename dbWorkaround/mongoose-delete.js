const {mongoose} = require('./../server/db/mongooseConfig');
const {ToDoModel} = require('./../server/models/ToDo');
const {UserModel} = require('./../server/models/Users');

ToDoModel.deleteOne({_id: '5eaf1192841831016480bf13'}).then((result) => {
  console.log('Successfully Deleted: ', result);
}, (error) => {
  console.log('Error while deleting the document from collections');
});

ToDoModel.findOneAndRemove({_id: '5eb27f43f5ac890ee0b33261'}).then((result) => {
  console.log('Successfully Deleted ', result);
}, (error) => {
  console.log('Error while deleting the document from collection', error);
});
