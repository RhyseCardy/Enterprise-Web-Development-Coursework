
var path = require('path'),
      express = require('express'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      app = express(),
      port = 3000,
      {name} = require("ejs"),
      req = require('express/lib/request'),
      mongoose = require("mongoose"),
      MongoClient = require('mongodb').MongoClient;
      passport = require ("passport"),
      LocalStrategy = require("passport-local");
      passportLocalMongoose = 
        require("passport-local-mongoose")
const User = require("./User");


// mongoose.connect("mongodb://localhost/27017");

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});

//Establishing connection to mongodb
let mongoUrl = 'mongodb://localhost:27017/';
let db;

MongoClient.connect(mongoUrl, function (err, database){
  if (err) throw err;

  db = database.db("UserQuotes");

  db.createCollection("users", function (err2, res){
    if (err2) {console.log("collection already created")}
  })

//   app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   });

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

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


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

app.post('/createAccount', async (req, res) => {
  const user = await User.create({
    email: req.body.email,
    password: req.body.password
  });
  res.render('pages/list')
})

app.get("/register", function (req, res) {
  res.render('pages/register');
});

//Create Account Post Request
// app.post("/createAccount", function (req, res) {  

//   let email = req.body.regInputEmail;
//   let password = req.body.regInputPassword;

//   //Adds New User To The Database
//   db.collection('users').findOne({email:email}, function (err, result){
//     //Error Handler
//     if (err) throw err;

//     //Check If Account Already Exists
//     if (!result) {
//       db.collection('users').count(function(err2, result2){
//         //Error Handler
//         if (err2) throw err2;

//         //Code To Add New User To The Database
//         db.collection('users').insertOne({
//           email:email,
//           password: password

//         }, function(err3, result3){
//           //Error Handler
//           if (err3) throw err3;
//         });
//       });
//       console.log("Account Successfully Created")
//     } else {
//       console.log("Account Has Already Been Created")
//     };

//   });
//   //Go Back To Login Page Afterwards
//   res.redirect("/login");
// });



//Login Post Request
app.post("/login", async function (req, res){
try {
    //Check The User Exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //Check The Password Matches
      const result = req.body.password === user.password;
      if (result) {
        res.render("pages/list");
      } else {
        res.status(400).json({ error: "Password Does Not Match!" });
      }
    } else {
      res.status(400).json({ error: "User Does Not Exist!" });
    }
  } catch (error) {
    res.status(400).json({ error });
}
});

app.get("/logout", function (req, res) {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

  //Recieve Inputs From the Form
//   let email = req.body.logInputEmail;
//   let password = req.body.logInputPassword;
//   console.log(email, password)

//   //Find The Correct User In Database To Check Password and Account Exists
//   db.collection("users").findOne({email:email}, function *(err, result) {
//     console.log(result)
//     //Error Handler
//     if (err) throw err;

//     //Check Account Already Exists
//     if (!result) {
//       res.redirect("/login")
//       console.log(result)
//       return;
      
//     }

//     //Check That The Password Is Correct
//     if (result.password == password){
//       //Set the Variables For Session
//       req.session.loggedIn = true;
//       req.session.email = email;
      

//       db.createCollection(email, function (err, res){
//         if (err) {console.log("Collection Already Created")}
//       });

//       //Send Users To List Page After Logging In
//       db.collection(email).find().toArray(function (err, result){
//         if (err) throw err;
//         res.render('pages/list', {
//           quotes: result,
//           isLoggedIn: req.session.loggedIn
//         })
//       });
//     } else {
//       //Redirect To The Login Page If Password Is Incorrect
//       res.redirect("/login")
//     };
//   });
// });

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
app.get('/quotes', isLoggedIn, function(req, res){

    let name = req.session.email

    db.createCollection(name, function (err, res){
      if (err) {console.log("collection already created")}
    });

    db.collection(name).find().toArray(function (err, result){
      if (err) throw err;
      res.render('pages/list', {
        quotes: result, 
        isLoggedIn: req.session.loggedIn
      })
    });

   if (error = true) {
    res.render('pages/login', {error:error});
  }

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


//Error response page
app.use(function (req, res, next) {
    res.send("This Page Does Not Exist")
});

