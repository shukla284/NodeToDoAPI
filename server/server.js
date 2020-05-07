require('./config/config.js');

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var port = process.env.PORT;

var {mongoose} = require('./db/mongooseConfig');
var {ToDoModel} = require('./models/ToDo');
var {UserModel} = require('./models/Users');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (request, response) => {

   var todo = new ToDoModel({
     name: request.body.name,
     user: request.body.user,
     createdAt: new Date().getTime()
   });

   todo.save().then((todo) => {
     response.status(200).send({todo});
   }, (error) => {
     response.status(400).send(error);
   });
});

// x-auth : Custom header not neccsarily supported by Http
// header is sent as the key value pair
app.post('/users', (request, response) => {
   var body = _.pick(request.body, ['email', 'password']);
   var user = new UserModel(body);

   user.save().then((user) => {
     return user.generateAuthToken();
   }).then((token) => response.status(200).header('x-auth', token).send({user}))
   .catch((error) => response.status(400).send(error));
});

app.get('/todos', (request, response) => {
  ToDoModel.find().then((resultDocs) => {
    response.status(200).send({resultDocs});
  }, (error) => {
    response.status(400).send(error);
  });
});

app.get('/users', (request, response) => {
  UserModel.find().then((users) => {
    response.status(200).send({users});
  }, (error) => {
    response.status(400).send(error);
  });
});

app.get('/todos/:id', (request, response) => {
  var id = request.params.id;

  if(!ObjectID.isValid(id))
     response.status(404).send();

  ToDoModel.findById(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.status(200).send({todo});
  }).catch((e) => {
    return response.status(400).send();
  });
});

app.delete('/todos/:id', (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id))
       response.status(404).send();

    ToDoModel.findOneAndRemove({_id: id}).then((todo) => {
      if (!todo) {
        return response.status(404).send();
      }
      response.status(200).send({todo});
    }, (error) => {
      return response.status(400).send();
    });
});

app.delete('/user/:id', (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id))
       response.status(404).send();

    UserModel.findOneAndRemove({_id: id}).then((user) => {
      if (!user) {
        return response.status(404).send();
      }
      response.status(200).send({user});
    }, (error) => {
      response.status(400).send();
    });
});

app.patch('/todos/:id', (request, response) => {
  var id = request.params.id;
  var body = _.pick(request.body, ['name', 'completed']);

  if (!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed)
      body.completedAt = new Date().getTime();
  else
      body.completedAt = null, body.completed = false;

  ToDoModel.findByIdAndUpdate(id, {
    $set: body
  }, {new: true})
  .then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.status(200).send({todo});

  }).catch((e) => {
    response.status(400).send();
  });
});

app.listen(port, () => {
  console.log('Server started to run on port', port);
});

module.exports = {app};
