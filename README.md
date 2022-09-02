# Exercise tracker

This is a Node.js (with Express.js) small app that uses MongoDB to store data which is part of the FCC Back End Certification.
Collect users and their information about exercises(description, duration, data)

## Features

- User can send username with ```POST``` to ```/api/users``` using form to create a new user. Returned response from ```POST /api/users``` will be an object with ```username``` and ```_id``` properties.
- Sending ```POST``` to ```/api/users/:_id/exercises``` with form containing description, duration, and optionally date will save information about exercise. If date is empty, the current date will be used. The response returned will be the user object with the exercise fields added.
- User can make a ```GET``` request to ```/api/users``` to get a list of all users in array containing a user's ```username``` and ```_id```.
- A ```GET``` request to ```/api/users/:_id/logs``` will return the user object with a array of all the exercises added with properties ```description```, ```duration```, and ```date```.
- User can add ```from```, ```to``` and ```limit``` parameters to a ```GET /api/users/:_id/logs``` request to retrieve part of the log. ```from``` and ```to``` are dates in ```yyyy-mm-dd``` format. ```limit``` is an integer of how many entries to display

## Example usage

```
POST https://project-exercisetracker.iotardis.repl.co/api/users - username
GET https://project-exercisetracker.iotardis.repl.co/api/users
POST https://project-exercisetracker.iotardis.repl.co/api/users/:_id/exercises - [exercise info]
GET /api/users/:_id/logs?[from][&to][&limit]
```

## Example output

```json
{"_id":"6310b04dabcd6007bef09c45","username":"olga"}
{"username":"fcc_test_16621146456","count":2,"_id":"6311db55abcd6007bef1ce6e","log":[{"description":"test","duration":60,"date":"Mon Jan 01 1990"},{"description":"test","duration":60,"date":"Wed Jan 03 1990"}]}
```

## [Try it](https://project-exercisetracker.iotardis.repl.co)
