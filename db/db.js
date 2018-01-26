var MongoClient = require( 'mongodb' ).MongoClient;

var db;
MongoClient.connect("mongodb://10.142.0.4:27017/greenhouse_santa", function(err, client) {
  if(!err) {
    console.log("Connected successfully to server");
    db = client.db("greenhouse_santa");
  } else {
    console.log("Failed connecting to server")
  }
});

module.exports = function getDb() {
  return db
}
