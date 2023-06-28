const mongoose = require("mongoose");


// ******* REGISTER Model ***********

const userSchema = new mongoose.Schema({
    role: String,
    name: String,
    username: String,
    email: String,
    password: String,
    uid: String,
  });
  
  const User = mongoose.model("registrations", userSchema);

  module.exports = User;