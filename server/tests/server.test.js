const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const ToDoModel = require('./../models/ToDo.js').ToDoModel;

const todos = [
  {_id: new ObjectID(), name: 'First Test ToDo'},
  {_id: new ObjectID(), name: 'Second Test ToDo'}
]
// beforeEach((done) => {
//   ToDoModel.deleteMany({}).then(() => done());
// });

beforeEach((done) => {
  ToDoModel.deleteMany().then(() => {
    return ToDoModel.insertMany(todos);
  }).then(() => done());
});

describe('POST/todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Testing in progress'
    var username = 'Kabir Singh';

    request(app)
    .post('/todos')
    .send({name: text, user: username})
    .expect(200)
    .expect((response) => {
      expect(response.body.name).toBe(text);
    })
    .end((error, response) => {
      if (error)
        return done(error);

      ToDoModel.find().then((todos) => {
        expect(todos.length).toBe(3);
        expect(todos[2].name).toBe(text);
        expect(todos[2].user).toBe(username);
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
     .expect(200)
     .expect((response) => {
       expect(response.body.resultDocs.length).toBe(2);
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
