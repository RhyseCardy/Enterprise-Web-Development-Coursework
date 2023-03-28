
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const app = express();
const {name} = require("ejs")
const port = 3000
const req = require('express/lib/request');
const MongoClient = require('mongodb').MongoClient;


//Establishing connection to mongodb
var mongoUrl = 'mongodb://localhost:27017/';
var db;

MongoClient.connect(mongoUrl, function (err, database){
  if (err) throw err;

  db = database.db("UserQuotes");

  db.createCollection("users", function (err2, res){
    if (err2) {console.log("collection already created")}
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

});



//Create static folder
app.use(express.static(path.join(__dirname, '/../frontend')));
//setting up body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

//Setup ejs
app.set('views', path.join(__dirname, '/../frontend/views'))
app.set('view engine', 'ejs');

app.engine('ejs', require('ejs').__express);


//Setup the session
app.use(session({secret: 'QuoteCreatorSecret', resave: false, saveUninitialized: false}));


//The route for the home page (default)
app.get('/', function(req, res){
  res.render('pages/index')
});

//Also the route for the home page
app.get('/home', function(req, res){
  res.render('pages/index')
});

//The route for the login page
app.get('/login', function(req, res){
  error = false;
  res.render('pages/login')
});


//Create Account Post Request
app.post("/createAccount", function (req, res) {  

  var email = req.body.regInputEmail;
  var password = reg.body.regInputPassword;

  //Adds New User To The Database
  db.collection('users').findOne({email:email}, function (err, result){
    //Error Handler
    if (err) throw err;

    //Check If Account Already Exists
    if (!result) {
      db.collection('users').count(function(err2, result2){
        //Error Handler
        if (err2) throw err2;

        //Code To Add New User To The Database
        db.collection('users').insertOne({
          email:email,
          password: password

        }, function(err3, result3){
          //Error Handler
          if (err3) throw err3;
        });
      });
      console.log("Account Successfully Created")
    } else {
      console.log("Account Has Already Been Created")
    };

  });
  //Go Back To Login Page Afterwards
  res.redirect("/login");
});



//Login Post Request
app.post("/login", function (req, res){
  //Recieve Inputs From the Form
  var email = req.body.logInputEmail;
  var password = req.body.logInputPassword;

  //Add A New User To The Database
  db.collection("users").findOne({email:email}, function *(err, result) {
    //Error Handler
    if (err) throw err;

    //Check Account Already Exists
    if (!result) {
      res.redirect("/login")
      return;
    }

    //Check That The Password Is Correct
    if (result.password == password){
      //Set the Variables For Session
      req.session.loggedIn = true;
      req.session.email = email;

      db.createCollection(email, function (err, res){
        if (err) {console.log("Collection Already Created")}
      });

      //Send Users To List Page After Logging In
      db.collection(email).find().toArray(function (err, result){
        if (err) throw err;
        res.render('pages/list', {
          quotes: result,
          isLoggedIn: req.session.loggedIn
        })
      });
    } else {
      //Redirect To The Login Page If Password Is Incorrect
      res.redirect("/login")
    };
  });
});



//The route for the quotes page
//WILL NEED ADDITIONAL WORK
app.get('/quotes', function(req, res){

  if (req.session.loggedIn)

  res.render('pages/list')
});

//Error response page
app.use(function (req, res, next) {
    res.send("this page does not exist")
});

