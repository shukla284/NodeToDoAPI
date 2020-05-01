const {MongoClient} = require('mongodb');
const dbURL = 'mongodb://localhost:27017/';

MongoClient.connect(dbURL, (error, client) => {

   if (error)
      return console.log('Unable to connect to MongoDB Server');
   var db = client.db('ToDoApp');
   console.log('Successfully connected to MongoDB Server');

   // var userList = [{
   //   name: 'xx',
   //   age: 25,
   //   location: 'Prayagraj, Uttar Pradesh, India'
   // }, {
   //   name: 'xxx',
   //   age: 25,
   //   location: 'Kohima, India'
   // }, {
   //   name: 'xxx',
   //   age: 23,
   //   location: 'Prayagraj, Uttar Pradesh, India'
   // }, {
   //   name: '// XXX: ',
   //   age: 21,
   //   location: 'Ahmedabad, India'
   // }];
   //
   // db.collection('UserDetails').insertMany(userList, (error, result) => {
   //   if (error)
   //     return console.log('Unable to insert new document in collection');
   //
   //   console.log('Successfully inserted the document into collection \n');
   //   console.log(JSON.stringify(result.ops, undefined, 2));
   // });

   db.collection('UserDetails').find({
     //$or: [{age: {$lt : 25}}, {location: 'Kohima, India'}]
     age: {$gt: 23}
   }).toArray().then((resultDocs) => {
     console.log('Documents under UserDetails \n');
     console.log(JSON.stringify(resultDocs, undefined, 2));
   }, (error) => {
     console.log('Unable to get the documents for the given condition(s) \n');
     console.log('Error : ', error);
   });


   db.collection('UserDetails').find().count().then((counts) => {
      console.log('Total counts of the users ', counts);
   }, (error) => {
      console.log('Error while accessing the records', error);
   });

   db.collection('UserDetails').find({
     name: 'xxx'
   }).count().then((counts) => {
     console.log('Number of docs with Name: Shivam Shukla', counts);
   }, (error) => {
     console.log('Error while finding for docs', error);
   });

   db.collection('UserDetails').find({
     name: 'xxx'
   }).toArray().then((resultDocs) => {
     console.log('Matching Docs with Name: Shivam Shukla \n');
     console.log(resultDocs);
   }, (error) => {
     console.log('Error while fetching data ', error);
   });
   
   client.close();
});
