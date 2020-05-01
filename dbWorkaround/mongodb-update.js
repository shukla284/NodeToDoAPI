const {MongoClient, ObjectID} = require('mongodb');
const dbURL = 'mongodb://localhost:27017/';

MongoClient.connect(dbURL, (error, client) => {
  if (error)
     return console.log('Error while connecting to MongoDB Server');

  console.log('Successfully connected to the MongoDB Server');
  var db = client.db('ToDoApp');

  db.collection('UserDetails').findOneAndUpdate({
    _id: new ObjectID('5eabb93f5e05b3428060df54')
  }, {
    $set: {
      location: 'Ahmedabad, Gujrat'
    },
    $inc: {age :1}
  }, {returnOriginal: false}).then((result) => {
    console.log('Successfully updated the document in collection \n');
    console.log(result);
  }, (error) => {
    console.log('Error while updating the document in collection', error);
  });

  client.close();
});
