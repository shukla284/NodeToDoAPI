require('./config/config.js');

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var bcrypt = require('bcryptjs');

var port = process.env.PORT;

var {mongoose} = require('./db/mongooseConfig');
var {ToDoModel} = require('./models/ToDo');
var {UserModel} = require('./models/Users');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, (request, response) => {

   var todo = new ToDoModel({
     name: request.body.name,
     createdAt: new Date().getTime(),
     _created: request.user._id
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

app.get('/todos', authenticate, (request, response) => {
  ToDoModel.find({_created: request.user._id}).then((todos) => {
    response.status(200).send({todos});
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

app.get('/todos/:id', authenticate, (request, response) => {
  var id = request.params.id;

  if(!ObjectID.isValid(id))
     response.status(404).send();

  ToDoModel.findOne({
      _id: id,
      _created: request.user._id
    }).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.status(200).send({todo});
  }).catch((e) => {
    return response.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id))
       response.status(404).send();

    ToDoModel.findOneAndRemove({
      _id: id,
      _created: request.user._id
      }).then((todo) => {
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

app.patch('/todos/:id', authenticate, (request, response) => {
  var id = request.params.id;
  var body = _.pick(request.body, ['name', 'completed']);

  if (!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed)
      body.completedAt = new Date().getTime();
  else
      body.completedAt = null, body.completed = false;

  ToDoModel.findOneAndUpdate({
    _id: id,
    _created: request.user._id
  }, {
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

// private route
app.get('/user/me', authenticate, (request, response) => {
    response.status(200).send(request.user);
});

app.post('/user/login', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);

    UserModel.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        response.header('x-auth', token).send({user});
      });
    }).catch((error) => response.status(400).send());
});

// we will be deleting token here
app.delete('/users/me/token', authenticate, (request, response) => {
  request.user.removeToken(request.token).then(() => {
    response.status(200).send();
  }, () => response.status(400).send());
});

app.listen(port, () => {
  console.log('Server started to run on port', port);
});

module.exports = {app};
