const schemas = require("./schemas");
const mongoose = require("mongoose");

var USER = mongoose.model("USER", schemas.userSchema);

module.exports = {
  USER: USER
};