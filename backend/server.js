//
//TEST SERVER
// 
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const app = express();
const {name} = require("ejs")
const port = 3000
const req = require('express/lib/request');


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

//The route for the quotes page 
//WILL NEED ADDITIONAL WORK
app.get('/quotes', function(req, res){
  res.render('pages/list')
});

//Error response page
app.use(function (req, res, next) {
    res.send("this page does not exist")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});