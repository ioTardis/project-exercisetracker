const mongoose = require("mongoose");

const exercise = {
  description: String,
  duration: Number,
  date: String
};

const userSchema = new mongoose.Schema({
  username: String,
  exercises: [exercise]
});

module.exports = {
  userSchema: userSchema
};