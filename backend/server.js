
const path = require('path'),
      express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      app = express(),
      {name} = require("ejs"),
      port = 3000,
      req = require('express/lib/request'),
      MongoClient = require('mongodb').MongoClient;


//Establishing connection to mongodb
let db;

MongoClient.connect("mongodb://localhost:27017/", function (err, database){
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
  res.render('pages/login')
});


//Create Account Post Request
app.post("/createAccount", function (req, res) {  

  let email = req.body.regInputEmail;
  let password = req.body.regInputPassword;

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
    // if (!result) {
    //   res.redirect("/login")
    //   console.log(result)
    //   return;
      
    // }

    //Check That The Password Is Correct
    if (result.password == password){
      //Set the Variables For Session

      req.session.user = {
        email: email,
        loggedIn: true
      }

      // req.session.loggedIn = true;
      // req.session.email = email;
      

      db.createCollection(email, function (err, res){
        if (err) {console.log("Collection Already Created")}
      });

      //Send Users To List Page After Logging In
      db.collection(email).find().toArray(function (err, result){
        if (err) throw err;
        res.render('pages/list', {
          quotes: result,
          user: req.session.user
          //isLoggedIn: req.session.loggedIn
        })
      });
    } else {
      //Redirect To The Login Page If Password Is Incorrect
      res.redirect("/login")
    };
  });
});

app.post("/addQuote", function(req, res){
  //Get the name of the user to create the database collection
  let name = req.session.email

  //Collect Data From The Form
  let workerNumb = req.body.workerNumb
  let hoursNumb = req.body.hoursNumb
  let hourlyRate = req.body.hourlyRate
  let personPay = req.body.personPay

  db.createCollection(name, function (err, res){
    if (err) {console.log("Collection Already Created")}
  });

  //Add The Quote Info To The Database
  db.collection(name).insertOne({
    WorkerNumb: workerNumb,
    HoursNumb: hoursNumb,
    HourlyRate: hourlyRate,
    PersonPay: personPay
  }, function (err2, result2){
    if (err2) throw err2;
  });

  db.collection(name).find().toArray(function (err, result){
    if (err) throw err;
    res.render('pages/list', {
      quotes: result,
      isLoggedIn: req.session.loggedIn
    })
  });

});


//The route for the quotes page
//WILL NEED ADDITIONAL WORK
app.get('/list', function(req, res){

  if (req.session.loggedIn){

    var name = req.session.email

    db.createCollection(name, function (err, res){
      if (err) {console.log("collection already created")}
    });

    db.collection(name).find().toArray(function (err, result){
      if (err) throw err;
      res.render('pages/list', {
        // quotes: result,
        user: req.session.user, //POTENTIALLY REMOVE THIS
        isLoggedIn: req.session.loggedIn
        
      })
      console.log(loggedIn)
    });

  } else {
    var error = true;
    res.render('pages/login', {error:error});
  }

});

//Error response page
app.use(function (req, res, next) {
    res.send("This Page Does Not Exist")
});

