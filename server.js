const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const path = require('path');
const pug = require('pug');
const router = express.Router();

const cors = require('cors');

const {users} = require('./models/users.js');
const {checkUser, addUser} = require('./controls/userName');
const {checkUserId} = require('./controls/exercise.js');
const {exerciselog} = require('./controls/exerciselog.js');


const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' );

app.use(cors());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "views"));
app.locals.basedir = path.join(__dirname, 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded();



app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//  This is where you post a new user and get userId
app.post('/api/exercise/new-user', urlencodedParser, (req, res) => {
    let username = req.body.username;
    checkUser(username).then((response) => addUser(response))
    .then((UserObject)=> res.json(UserObject))
    .catch((error) => console.log(error))
});

// This is to send the user list with the request Get /api/exercise/users
app.get('/api/exercise/users', (req, res) => {
      users.find({},{_id: 1, username: 1}).sort({username: 1})
        .then((users) => res.render('users.pug', {title: 'Users Table', users}))
        .catch((error) => res.send("Something went wrong!  " + error));
});

//This is where you post a exercise log
app.post('/api/exercise/add', urlencodedParser, (req, res) => {
  checkUserId(req.body).then((response) =>  res.json(response))
  .catch((error) => console.log(error));
});

//This is where you post exercise log data 
app.get('/api/exercise/log', (req, res) => {
  let request = {
      userid: req.query.userid,
      from: req.query.from,
      to: req.query.to,
      limit: req.query.limit
      };
  exerciselog(request).then(object => res.render('exercises.pug', {title: 'Exercise Log', object}));  
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

//module.exports = router;