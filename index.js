const express = require('express');
const app = express();

const cors = require('cors');

const mongoose = require('mongoose');
const models = require('./models')

const bodyParser = require("body-parser");
require('dotenv').config();

// connection to the database
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// listen the port
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

// receiving POST with username to save
app.post('/api/users', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let username = req.body.username;
  // searching the user and editing/saving
  models.USER.findOneAndUpdate(
    { username: username},
    { username: username},
    { new:true, upsert: true},
    (err, savedUser) => {
      if (!err){
        let id = savedUser["_id"];
        res.json({username: username, _id: id});
      }
    }
  );
});

// receiving GET request to list all users
app.get('/api/users', (req, res) => {
  models.USER.find({})
  .select({ username: 1, _id: 1})
  .exec((err, usersArr) => {
    if (!err) {
      res.json(usersArr);
    } console.log(err);
  });
});

// receiving POST request to add exercise for particular user
app.post('/api/users/:_id/exercises', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let id = req.params["_id"];
  let date = req.body.date;
  
  if (typeof req.body.date === 'undefined' || req.body.date === '') {
    date = new Date();
  } else {
    date = new Date(date);
  }
  date = date.toDateString();
  
  let exercise = {
    description: req.body.description,
    duration: Number(req.body.duration),
    date: date
  }
  
  models.USER.findByIdAndUpdate(id, { $push: { exercises: exercise }}, { new: true}, (err, savedExercise) => {
    if (!err) {
      res.json({ username: savedExercise.username, description: exercise.description, duration: exercise.duration, date: exercise.date, _id: savedExercise["_id"]});
    } else console.log(err);
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  let id = req.params["_id"];
  models.USER.findById(id, (err, userFound) => {
    let log = {
      username: userFound.username,
      count: userFound.exercises.length,
      _id: id,
      log: userFound.exercises
    }
    if (!err) {
      res.json(log);
    } else console.log(err);
  });
});