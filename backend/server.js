// Packages and Variables
const path = require('path'),
      express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      app = express(),
      {name} = require("ejs"),
      port = 3000,
      req = require('express/lib/request'),
      MongoClient = require('mongodb').MongoClient,
      bcrypt = require('bcrypt');


//Establishing connection to mongodb
var db;

// Setup Mongo connection
MongoClient.connect("mongodb://localhost:27017/", function (err, database){
  if (err) throw err;

  //Database Name
  db = database.db("UserQuotes");

  // Colleection to store user information
  db.createCollection("users", function (err2, res){
    if (err2) {console.log("collection already created")}
  })

  // Collection to store quote information
  db.createCollection("quotes", function (err3, res){
    if (err3) {console.log("collection already created")}
  })

  // Allow website to run on the chosen port
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

  // Fill variables with user inputted page elements
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

        //Code To Add New User and login information To The Database using email and hashed password
        bcrypt.hash(password, 10, function(err, hashedPassword){
            let password = hashedPassword;
            db.collection('users').insertOne({
              email:email,
              password: password
            }, function(err3, result3){
              //Error Handler
              if (err3) throw err3;
            });
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
  db.collection("users").findOne({email:email}, function (err, result) {
    //Error Handler
    if (err) throw err;

    //Check Account Already Exists
    if (!result) {
      res.redirect("/login")
      console.log(result)
      return;
      
    }

    //Check That The Password Is Correct
    bcrypt.compare(password, result.password, function(err, result1){
      if(result1){ //if password correct
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
      }
    });
  });
});

// Make Quote function that collected inputted quote info and adds it to database to be recieved in the 'list' page
app.post("/makeQuote", function (req, res) {  
  console.log(req.body)
  let workers = req.body.workers;
  let hours = req.body.hours;
  let pay = req.body.pay;
  let payPerPerson = req.body.payPerPerson;
  let priceTotal = req.body.totalPrice;
  let createdBy = req.session.email

  //Adds New Quote To The Database
  db.collection('quotes').findOne({workers:workers}, function (err, result){
    //Error Handler
    if (err) throw err;

    //Check If Quote Already Exists
      db.collection('quotes').count(function(err2, result2){
        //Error Handler
        if (err2) throw err2;

        //Code To Add New Quote To The Database
            db.collection('quotes').insertOne({
              workers: workers,
              hours: hours,
              pay: pay,
              payPerPerson: payPerPerson,
              priceTotal: priceTotal,
              createdBy: createdBy
            }, function(err3, result3){
              //Error Handler
              if (err3) throw err3;
            });
          
        });
        
      console.log("Quote Successfully Added")
  });
  //Go Back To Login Page Afterwards
  res.render("pages/index");
});

// Function to recieve the quote info that can then be used to fill dynamic table in 'list' page 
app.use("/getAllQuotes", async function(req, res){
  let quoteData = await db.collection("quotes").find({createdBy: req.session.email}).toArray()
  //JSON.stringify(quoteData)
  res.send(quoteData)
  console.log(quoteData)
});

// Function to delete all the quotes from the Mongo database when the corresponding button is clicked
app.use("/deleteAllQuotes", async function(req, res){
  let quoteData = await db.collection("quotes").deleteMany({createdBy: req.session.email});
  console.log('Quotes Deleted by' + req.session.email)
});


//The route for the quotes page
app.get('/list', function(req, res){

  if (req.session.loggedIn){
    console.log(req.session.loggedIn)
    var name = req.session.email

    db.createCollection(name, function (err, res){
      if (err) {console.log("collection already created")}
    });

    // Code to detect if the user is logged in. If so, user is sent to correct page,
    // if not, user is sent to login page to try again. Login page is also rendered
    // as default if not logged in
    db.collection(name).find().toArray(function (err, result){
      if (err) throw err;
      res.render('pages/list', {
        quotes: result,
        isLoggedIn: req.session.loggedIn
        
      })
    });

  } else {
    var error = true;
    res.render('pages/login', {error:error});
  }

});

//Route For The Edit Quote Page
app.get("/edit", function(req, res){
  
  if (req.session.loggedIn){
    req.session.email = req.session.email;
    res.render('pages/edit', {
      email: req.session.email,
      isLoggedIn: req.session.loggedIn
    });

  } else {
    error = true;
    res.render('pages/login', {error:error});
  }
});

//Starting place for the update quote function, unfinished
app.post("/updateQuote", function(req, res){

})

//Error response page for when a page cannot be found
app.use(function (req, res, next) {
    res.send("This Page Does Not Exist")
});

