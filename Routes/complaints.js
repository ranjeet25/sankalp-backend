const express = require("express");
const router = express.Router();

const Complaint = require("../Model/complaint")

router.post("/complaints", (req, res) => {
    data = req.body;
    res.send(data);
    // console.log(data);
  
    Complaint.create({
      username: req.body.username,
      uid: req.body.uid,
      incharge_name: req.body.p_incharge,
      branch: req.body.branch,
      complaint: req.body.complaint,
      date:req.body.date,
      time:req.body.time,

    }).catch((err) => console.log(err));
  });
  
  router.put("/complaints", (req, res) => {
    var complaintID = req.body.complaintID;
    var comments = req.body.comments;
    var status = req.body.status;
  
    // console.log(status);
  
    Complaint.findOneAndUpdate(
      { _id: complaintID },
      {
        status: status,
        comments: comments,
      },
      { new: true }
    ).catch((err) => console.log(err));
  });

  module.exports = router;