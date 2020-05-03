const {MongoClient, ObjectID} = require('mongodb');
const dbURL = 'mongodb://localhost:27017/';

MongoClient.connect(dbURL, (error, client) => {
  // return here performs without any priblem unlike cpp
  if (error)
    return console.log('Unable to connect to connect to MongoDB Server');

  var db = client.db('ToDoApp');
  console.log('Successfully connected to MongoDB Server');

  db.collection('ToDo').insertOne({
    text: 'Creating ToDo Application',
    completed: false
  }, (error, result) => {
    if (error)
       return console.log('Unable to add document to collection', error);
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  // db.collection('UserDetails').insertOne({
  //    name: 'xxx',
  //    age: 23,
  //    location: 'Prayagraj, Uttar Pradesh, India'
  // }, (error, results) => {
  //    if (error)
  //       return console.log('Error while writing document to collection', error);
  //
  //     console.log('Successfully added the document \n');
  //     console.log(JSON.stringify(results.ops, undefined, 2));
  //
  //     var timeStamp = results.ops[0]._id.getTimestamp();
  //     console.log(`Timestamp embedded in ID ${timeStamp}`);
  // });

  client.close();
});
