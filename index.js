const express = require('express');
const app = express();

const cors = require('cors');

const mongoose = require('mongoose');
const models = require('./models');

const bodyParser = require('body-parser');
require('dotenv').config();

// connection to the database
mongoose.connect(process.env['MONGO_URI'], {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

app.use(cors());

// serving static file
app.use(express.static('public'));

// basic routing
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
});

// API endpoint
app.get('/api/hello', (req, res) => {
	res.json({
		greeting: 'hello API'
	});
});

// listen the port
const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});

// receiving POST with username to save
app.post('/api/users', bodyParser.urlencoded({ extended: false}),
  (req, res) => {
  	let username = req.body.username;
    
  	// searching the user and editing/saving
  	models.USER.findOneAndUpdate({ username: username }, 
      { username: username }, 
      { new: true, upsert: true },
  	  (err, savedUser) => {
    		if (!err) {
    			let id = savedUser['_id'];
    			res.json({
    				username: username,
    				_id: id
    			});
    		} else console.log('User not found');
  	  }
    );
  }
);

// receiving GET request to list all users
app.get('/api/users', (req, res) => {
	models.USER.find({})
	.select({	username: 1, _id: 1 })
	.exec((err, usersArr) => {
		if (!err) {
			res.json(usersArr);
		} console.log('User not found');
	});
});

// receiving POST request to add exercise for particular user
app.post('/api/users/:_id/exercises', 
  bodyParser.urlencoded({ extended: false }), 
  (req, res) => {
    let id = req.params['_id'];
    let date = req.body.date;
    
    (typeof req.body.date === 'undefined' || req.body.date === '') 
      ? date = new Date()
      : date = new Date(date);
    
    let exercise = {
      description: req.body.description,
      duration: Number(req.body.duration),
      date: date
    };
    
    models.USER.findByIdAndUpdate(id, 
      { $push: { exercises: exercise }}, 
      { new: true}, 
      (err, savedExercise) => {
        if (!err) {
          let output = {
            username: savedExercise.username, 
            description: exercise.description, 
            duration: exercise.duration, 
            date: exercise.date.toDateString(), 
            _id: savedExercise['_id']
          }
          res.json(output);
        } else console.log('User not found');
      }
    );
  }
);

app.get('/api/users/:_id/logs', (req, res) => {
	let id = req.params['_id'];
	let {	fromDateDate, toDate, limit } = req.query;

	models.USER.find({ _id: id },
    (err, userFound) => {
  		if (!err) {
  			let log = {};
  			let output = { log: [] };
  			let filtered = [];
  			let exercises = userFound[0].exercises;
        
  			for (let i in exercises) {
  				let date = new Date(exercises[i].date);
  				log = {
  					description: exercises[i].description,
  					duration: exercises[i].duration,
  					date: date.toDateString()
  				};
  				if (
  					(typeof toDate === 'undefined' && typeof fromDate === 'undefined') ||
  					(typeof toDate !== 'undefined' &&
  						new Date(toDate) > date &&
  						typeof toDate === 'undefined') ||
  					(typeof fromDate !== 'undefined' &&
  						new Date(fromDate) < date &&
  						typeof toDate === 'undefined') ||
  					(typeof fromDate !== 'undefined' &&
  						new Date(fromDate) < date &&
  						typeof toDate !== 'undefined' &&
  						new Date(toDate) > date)
  				) filtered.push(log);
  			}
  			if (typeof limit !== 'undefined') filtered = filtered.slice(0, limit);
  			output.log.push(filtered);
  			res.json({
  				username: userFound[0].username,
  				count: userFound[0].exercises.length,
  				_id: id,
  				log: output.log[0]
  			});
  		} else console.log('User not found');
	  }
  );
});