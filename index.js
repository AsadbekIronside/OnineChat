var app = require('express')();

var express = require('express');
var path = require('path');
var http = require('http').Server(app);
const io = require('socket.io')(http);
var validator = require('express-validator');
// import controller
var authRoute = require('./routers/authRoute');

// import Router file
var pageRouter = require('./routers/route');

var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var i18n = require("i18n-express");
app.use(bodyParser.json());
var urlencodeParser = bodyParser.urlencoded({ extended: true });

app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1200000
  }
}));

app.use(session({ resave: false, saveUninitialized: true, secret: 'nodedemo' }));
app.use(flash());
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["es", "en", "de", "ru", "it", "fr"],
  textsVarName: 'translation'
}));

// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

app.get('/layouts/', function (req, res) {
  res.render('view');
});


// apply auth router
authRoute(app);

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

  // Define All Route
pageRouter(app); 

io.on('connection', (socket)=>{
  console.log('connected!');
  socket.emit('get-message');
});

app.get('/', function (req, res) {
  res.redirect('/');
});

http.listen(8000, function () {
  console.log('listening on *:8000');
});