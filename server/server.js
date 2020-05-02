var express = require('express');
var bodyParser = require('body-parser');

var port = 3000;

var {mongoose} = require('./db/mongooseConfig');
var {ToDoModel} = require('./models/ToDo');
var {UserModel} = require('./models/Users');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (request, response) => {
   console.log(request.body);

   var todo = new ToDoModel({
     name: request.body.name,
     user: request.body.user
   });

   todo.save().then((doc) => {

     console.log('Successfully added the document to collection', doc);
     response.status(200).send(doc);
   }, (error) => {

     console.log('Error while adding the document to the collection', error);
     response.status(400).send(error);
   });
});

app.listen(3000, () => {
  console.log('Server started to run on port 3000');
});

module.exports = {app};
