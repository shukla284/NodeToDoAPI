var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var port = process.env.PORT || 3000;

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

app.post('/user', (request, response) => {
  console.log('User Request Body ', request.body);

  var user = new UserModel({
    username: request.body.username,
    email: request.body.email
  });

  user.save().then((doc) => {
     console.log('Successfully inserted the document in collection Users');
     response.status(200).send(doc);
  }, (error) => {
    console.log('Error while inserting the document in collections');
    response.status(400).send(error);
  });
});


app.get('/todos', (request, response) => {
  ToDoModel.find().then((resultDocs) => {
    console.log('Successfully fetched the docs from collections');
    response.status(200).send({resultDocs});
  }, (error) => {
    console.log('Error while fetching the data', error);
    response.status(400).send(error);
  });
});

app.get('/users', (request, response) => {
  console.log('Request intercepted users ');
  UserModel.find().then((docs) => {
    console.log('Successfully inserted the doc in the collections');
    response.status(200).send(docs);
  }, (error) => {
    console.log('Error while inserting the doc in collections');
    response.status(400).send(error);
  });
});

app.get('/todos/:id', (request, response) => {
  var id = request.params.id;

  if(!ObjectID.isValid(id))
     response.status(404).send();

  ToDoModel.findById(id).then((todo) => {
    if (!todo) {
      console.log('No such todo found');
      response.status(404).send();
    }
    console.log('Successfully fetched the document in collection', todo);
    response.status(200).send({todo});
  }).catch((e) => {
    console.log('Error while finding the doc', error);
    response.status(400).send();
  });
});

app.delete('/todos/:id', (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id))
       response.status(404).send();

    ToDoModel.findOneAndRemove({_id: id}).then((todo) => {
      if (!todo) {
        console.log('Requested Resource not found: ID: ', id);
        response.status(404).send();
      }
      console.log('Successfully deleted todo: ', todo);
      response.status(200).send(todo);
    }, (error) => {
      console.log('Error while finding and deleting object', error);
      response.status(400).send();
    });
});

app.delete('/user/:id', (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id))
       response.status(404).send();

    UserModel.findOneAndRemove({_id: id}).then((user) => {
      if (!user) {
        console.log('No such user found, ID : ', id);
        response.status(404).send();
      }
      console.log('Successfully deleted the user ID: ', id);
      response.status(200).send(user);
    }, (error) => {
      console.log('Error while deleting the document', error);
      response.status(400).send();
    });
});


app.listen(port, () => {
  console.log('Server started to run on port', port);
  UserModel.find().then((docs) => {
    console.log('Successfully inserted the doc in the collections');
    console.log(JSON.stringify(docs, undefined, 2));
  });
});

module.exports = {app};
