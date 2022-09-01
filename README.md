# Exercise tracker

This is a Node.js (with Express.js) small app that uses MongoDB to store data which is part of the FCC Back End Certification.
Collect users and their information about exercises(description, duration, data)

## Features

- Add user
- Save exercise with it description, duration and time
- Get all users saved in database
- If information about date is empty, app saves current time

## Example usage

```
POST https://project-exercisetracker.iotardis.repl.co/api/users - username
GET https://project-exercisetracker.iotardis.repl.co/api/users
POST https://project-exercisetracker.iotardis.repl.co/api/users/:_id/exercises - [exercise info]
```

## Example output

```json
{"_id":"6310b04dabcd6007bef09c45","username":"olga"}
```

## [Try it](https://project-exercisetracker.iotardis.repl.co)
