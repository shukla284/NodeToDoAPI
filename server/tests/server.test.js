const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ToDoModel} = require('./../models/ToDo.js');
const {UserModel} = require('./../models/Users.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST/todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Testing in progress'

    request(app)
    .post('/todos')
    .send({name: text})
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((response) => {
      expect(response.body.todo.name).toBe(text);
    })
    .end((error, response) => {
      if (error)
        return done(error);

      ToDoModel.find().then((todos) => {
        expect(todos.length).toBe(3);
        expect(todos[2].name).toBe(text);
        done();
      }, (error) => {
        done(error);
      })
    });
  });

  //Other test
  it('should not allow the invalid data body', (done) => {
    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send()
    .expect(400)
    .end((error, resposne) => {
      if (error)
       return done(error);

      ToDoModel.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});


describe('GET /todos', () => {
   it('should get all the todos ', (done) => {
     request(app)
     .get('/todos')
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((response) => {
       expect(response.body.todos.length).toBe(1);
     })
     .end(done);
   });

   it('should return todo doc', (done) => {
     request(app)
     .get(`/todos/${todos[0]._id.toHexString()}`)
     .expect(200)
     .expect((response) => {
       expect(response.body.todo.name).toBe(todos[0].name);
     })
     .end(done);
   });
});

describe('DELETE /todo/:id', () => {
  it('should delete one of todos', (done) => {
    var hexID = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexID}`)
    .expect(200)
    .expect((response) => {
      expect(response.body.todo._id).toBe(hexID);
    })
    .end((error, response) => {
      if (error)
         return done(error);

      ToDoModel.findById(hexID).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return 404 if the ID not found', (done) => {
      var id = new ObjectID()._id.toHexString();

      request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object ID is invalid', (done) => {
     request(app)
     .delete(`/todos/126563euiwui`)
     .expect(404)
     .end(done);
  });
});


describe('PATCH /todo', () => {
  it('should update the todo', (done) => {
      var id = todos[1]._id.toHexString();
      var text = 'Newer text pushed';

      request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        name: text
      })
      .expect(200)
      .expect((response) => {
         expect(response.body.todo.name).toBe(text);
         expect(response.body.todo.completed).toBe(true);
         expect(response.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when completed is false', (done) => {
      var id = todos[1]._id.toHexString();
      var text = "This must be the text";

      request(app)
      .patch(`/todos/${id}`)
      .send({
         name: text,
         completed: false
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.name).toBe(text);
        expect(response.body.todo.completed).toBe(false);
        expect(response.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
   it ('should return the user if authenticated', (done) => {
     request(app)
     .get('/user/me')
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((response) => {
       expect(response.body._id).toBe(users[0]._id.toHexString());
       expect(response.body.email).toBe(users[0].email);
     })
     .end(done);
   });

   it('should return 401 if user is unauthorized', (done) => {
     request(app)
     .get('/user/me')
     .expect(401)
     .expect((response) => {
       expect(response.body).toEqual({});
     })
     .end(done);
   });
});

describe('POST /users', () => {
  it ('should create a new user if credentials are correct', (done) => {
    var email = 'testemail@gmail.com';
    var password = 'test1234';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((response) => {
      expect(response.body.user._id).toExist();
      expect(response.body.user.email).toBe(email);
      expect(response.headers['x-auth']).toExist();
    })
    .end((error) => {
      if (error)
        return done(error);

       UserModel.findOne({email}).then((user) => {
         expect(user).toExist();
         expect(user.password).toNotBe(password);
         done();
       }).catch((error) => done(error));
    });
  });

  it ('should return validation error if invalid credentials are put', (done) => {
     var email = 'test123@gmail.com';
     var password = '123';

     request(app)
     .post('/users')
     .send({email, password})
     .expect(400)
     .end(done);
  });

  it ('should not create a user if email is in use', (done) => {
     request(app)
     .post('/users')
     .send({email: users[0].email, password: users[0].password})
     .expect(400)
     .end(done);
  });
});

describe('POST user/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/user/login')
    .send({email: users[1].email, password: users[1].password})
    .expect(200)
    .expect((response) => {
      expect(response.headers['x-auth']).toExist();
    })
    .end((error, response) => {
      if (error)
         return done();

      UserModel.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          auth: 'auth',
          token: response.headers['x-auth']
        });
        done();
      }).catch((error) => done(error));
    });
  });

  it('should reject invalid logins', (done) => {
     request(app)
     .post('/user/login')
     .send({email: users[1].email, password: 'qwerty9090'})
     .expect(400)
     .expect((response) => {
       expect(response.headers['x-auth']).toNotExist();
     })
     .end((error, response) => {
       if (error)
          return done(error);

      UserModel.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((error) => done(error));
     });
  });
});

describe('DELETE /users/me/token', () => {
  it ('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((error, response) => {
      if (error)
        return done(error);

      UserModel.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((error) => done(error));
    });
  });
});
