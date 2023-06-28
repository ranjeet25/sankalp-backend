const mongoose = require("mongoose");

const userComplaint = new mongoose.Schema({
    username: String,
    uid: String,
    incharge_name: String,
    branch: String,
    complaint: String,
    date:String,
    time:String,
    status: String,
    comments: String,
    studentSatisfaction: String,
    studentFeedback: String,
  });
  
  var Complaint = mongoose.model("complaints", userComplaint);

  module.exports = Complaint;