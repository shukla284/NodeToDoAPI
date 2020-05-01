const {MongoClient} = require('mongodb');
const dbURL = 'mongodb://localhost:27017';

MongoClient.connect(dbURL, (error, client) => {
  if (error)
     return console.log('Unable to connect to MongoDB Server');

  console.log('Successfully connected to MongoDB Server');
  db = client.db('ToDoApp');

  db.collection('UserDetails').insertOne({
    name: 'Shivam Shukla',
    age: 23,
    location: 'Prayagraj, Uttar Pradesh'
  }, (error, results) => {
    if (error)
       return console.log('Error while inserting documents');

    console.log('Successfully inserted the documents in collections \n');
    console.log(JSON.stringify(results.ops, undefined, 2));
  });

  var deleteObject = {
    name: "xxx",
    age: 23,
    location: "Prayagraj, Uttar Pradesh"
  };

  // deleting many records at a time.
  // db.collection('UserDetails').deleteMany(deleteObject).then((resultDelete) => {
  //   console.log('Successfully deleted the documents from collections \n');
  //   console.log(resultDelete);
  // }, (error) => {
  //   console.log('Error while deleting the documents specified \n');
  // });

  // db.collection('UserDetails').deleteOne(deleteObject).then((resultDoc) => {
  //   console.log('Successfully deleted the doc from collection \n');
  //   console.log(resultDoc);
  // }, (error) => {
  //   console.log('Error while deleting the record from collection');
  // });

  db.collection('UserDetails').findOneAndDelete({
    name: 'xxx'
  }).then((result) => {
    console.log('Successfully found and deleted the docs');
    console.log(JSON.stringify(result.value, undefined, 2));
  }, (error) => {
     console.log('Error while finding and deleting the doc from collection', error);
  });

  // db.collection('UserDetails').find({
  //   name: "xxx",
  //   age: 23,
  //   location: "Prayagraj, Uttar Pradesh"
  // }).toArray().then((resultDocs) => {
  //   console.log('Successfully fetched the result docs \n');
  //   console.log(JSON.stringify(resultDocs, undefined, 2));
  // }, (error) => {
  //   console.log('Error while fetching the documents from collections', error);
  // });

  db.collection('UserDetails').find({
    name: "xxx",
    age: 23,
    location: "Prayagraj, Uttar Pradesh"
  }).count().then((counts) => {
    console.log('Total Counts ', counts);
  }, (error) => {
    console.log('Error while fetching the records', error);
  });

  client.close();
});
