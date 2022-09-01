const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
require('dotenv').config();

// connection to the database
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true});

// creating model
let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  description: String,
  duration: Number,
  date: String
});
let USER = mongoose.model('User', userSchema);

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
  USER.findOneAndUpdate(
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
  USER.find({})
  .select({ username: 1, _id: 1})
  .exec((err, usersArr) => {
    if (!err) {
      res.json(usersArr);
    } console.log(err);
  });
});

