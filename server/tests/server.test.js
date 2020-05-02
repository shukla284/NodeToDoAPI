const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const ToDoModel = require('./../models/ToDo.js').ToDoModel;

beforeEach((done) => {
  ToDoModel.deleteMany({}).then(() => done());
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
        expect(todos.length).toBe(1);
        expect(todos[0].name).toBe(text);
        expect(todos[0].user).toBe(username);
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
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
