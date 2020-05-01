const {MongoClient} = require('mongodb');
const yargs = require('yargs');

const dbURL = 'mongodb://localhost:27017';

MongoClient.connect(dbURL, (error, client) => {
  if (error)
     return console.log('Unable to connect MongoDB Server');

  console.log('Successfully connected to MongoDB Server');
  const db = client.db('ToDoApp');

  // var argv = yargs
  //            .options({
  //              name: {
  //                demand: true,
  //                alias: 'n',
  //                describe: 'Add a username',
  //                string: true
  //              },
  //              age: {
  //                demand: true,
  //                alias: 'a',
  //                describe: 'Add a age to user',
  //                string: false
  //              },
  //              location: {
  //                demand: true,
  //                alias: 'l',
  //                describe: 'Add a location to user',
  //                string: true
  //              }
  //            }).help()
  //            .argv;
  //
  //
  //  db.collection('UserDetails').insertOne({
  //     name: argv.name,
  //     age: argv.age,
  //     location: argv.location
  //  }, (error, results) => {
  //    if (error)
  //       return console.log('Error while adding the user details', error);
  //    console.log('Successfully added the record');
  //    console.log(JSON.stringify(results.ops, undefined, 2));
  //  });

   db.collection('UserDetails').find({
     name: "xxx"
   }).toArray().then((resultDocs) => {
     console.log('Successfully fetced the matching records \n');
     console.log('Displaying the matching Docs from Collections');

     console.log(JSON.stringify(resultDocs, undefined, 2));
   }, (error) => {
     if (error)
       console.log('Error while fetching the records ', error);
   });

   client.close();
});
