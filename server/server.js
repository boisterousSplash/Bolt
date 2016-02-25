var express = require('express');
var mongoose = require('mongoose');

var app = express();

// connect to mongo database named "bolt"
// uncomment this line to use a local database
mongoose.connect('mongodb://localhost/bolt');
//mongoose.connect('mongodb://heroku_l3g4r0kp:61docmam4tnk026c51bhc5hork@ds029605.mongolab.com:29605/heroku_l3g4r0kp');

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// start listening to requests on port 8000
var port = Number(process.env.PORT || 8000);
app.listen(port, function () {
  console.log(`server listening on port ${port}`);
});


// export our app for testing and flexibility, required by index.js
module.exports = app;

//test
