const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// ******* MONGOOSED || MONGODB ***********

const mongourl = process.env.DBURL;

mongoose
  .connect(mongourl)
  .then(() => {
    console.log("Database connection successful");
    // console.log(path.join(__dirname, "../build"));
  })
  .catch((err) => {
    console.error("Database connection error");
  });

// app.use(express.static(path.join(__dirname, "../build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
//   // console.log("hello");
// });

// ******* REGISTER ROUTE ***********
const userSchema = new mongoose.Schema({
  role: String,
  name: String,
  username: String,
  email: String,
  password: String,
  uid: String,
});

const User = mongoose.model("registrations", userSchema);

app.post("/register", (req, res) => {
  User.findOne({
    $or: [
      { email: req.body.email },
      { username: req.body.username },
      { uid: req.body.uid },
    ],
  }).then((data) => {
    if (data == null) {
      User.create({
        role: req.body.role,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.pass,
        uid: req.body.uid,
      }).catch((err) => console.log(err));
      res.status(200).json({ msg: "User Created sucessfully" });
    } else {
      res.status(300).json({ msg: "User already exits" });
    }
  });
  // console.log(req.body.uid);
});

// UPDATE PROFILE
app.post("/update", (req, res) => {
  var data = req.body;
  // console.log(data);

  User.findOneAndUpdate(
    { username: data.oldUsername },
    { username: data.newUsername, password: data.newpassword },
    { new: true }
  )
    .then((res) => {
      if (res == null) {
        res.send({ message: null });
      }
    })
    .catch((err) => console.log(err));
});

// ******* REGISTER ROUTE ENDS ***********

// ******* LOGIN ROUTE ***********

// var _username;
// var _pass;
var uid;
app.post("/login", (req, res) => {
  var uname = req.body.uname;
  var password = req.body.pass;
  // console.log(req.body);
  // console.log(password);
  User.findOne({ username: uname })

    .then((doc) => {
      // uid = doc.uid;
      // console.log(doc);
      if (uname == "admin" && password == "admin@1234") {
        res.sendStatus(201);
      }

      if (uname == "resolver" && password == "resolver@1234") {
        res.sendStatus(202);
      }

      if (doc == null) {
        res.sendStatus(300);
      }

      if (doc.password === password) {
        // console.log(uid);
        uid = doc.uid;
        res.sendStatus(200);
        // console.log(doc);
      } else {
        res.sendStatus(300);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.get("/login_data", (req, res) => {
//   res.send({ username: _username, password: _pass, role: _role });
// });

// ******* LOGIN ROUTE ENDS ***********

// ******* complaints ROUTE ***********

const userComplaint = new mongoose.Schema({
  username: String,
  uid: String,
  incharge_name: String,
  branch: String,
  complaint: String,
  data: Date,
  status: String,
  comments: String,
  studentSatisfaction: String,
  studentFeedback: String,
});

var Complaint = mongoose.model("complaints", userComplaint);
var complaintsData;

app.post("/complaints", (req, res) => {
  data = req.body;
  res.send(data);
  // console.log(data);

  Complaint.create({
    username: req.body.username,
    uid: req.body.uid,
    incharge_name: req.body.p_incharge,
    branch: req.body.branch,
    complaint: req.body.complaint,
  }).catch((err) => console.log(err));
});

app.put("/complaints", (req, res) => {
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

// Admin complaint delete ROUTE
// Very Dangourus

app.get("/delete", (req, res) => {
  User.deleteMany({ "": "" }).then((data) => res.send(data));
});

app.post("/delete/:id", (req, res) => {
  // User.deleteOne({ "": "" }).then((data) => res.send(data));
  const userid = req.params.id;
  Complaint.deleteOne({ _id: userid }).then((data) => {
    console.log(data);
    // console.log(userId);
  });
});

// ******* ADMIN ROUTE ***********

app.get("/admin", (req, res) => {
  Complaint.find()
    .then((data) => {
      complaintsData = data;
      console.log("data");
      res.send(complaintsData);
    })
    .catch((err) => console.log(err));
});

// ******* RESOLVER ROUTE ***********

var userId = new Array();
app.post("/resolver/:id", (req, res) => {
  const userid = req.params.id;
  Complaint.findOne({ _id: userid }).then((data) => {
    userId.push(data);
    // console.log(data[0]);
  });
});

app.put("/studentFeedback", (req, res) => {
  var complaintID = req.body.complaintID;
  var studentSatisfaction = req.body.studentSatisfaction;
  var studentFeedback = req.body.studentFeedback;
  // console.log(status);

  var data;
  Complaint.findOneAndUpdate(
    { _id: complaintID },
    {
      studentSatisfaction: studentSatisfaction,
      studentFeedback: studentFeedback,
    },
    { new: true }
  )
    .then((result) => {
      data = result;
      // userId.forEach((element) => {
      //   if (element._id == complaintID) {
      //     userId.pop(element);
      //   }
      // });
      userId.push(data);
      // console.log(userId);
    })
    .catch((err) => console.log(err));
});

app.get("/resolver", (req, res) => {
  res.send(userId);
});

// ******* HISTORY ROUTE ***********

app.get("/history", (req, res) => {
  Complaint.find({ uid: uid })
    .then((data) => {
      complaintsData = data;
      complaintsData;
      res.send(complaintsData);
    })
    .catch((err) => console.log(err));
});
// ******* REMOVE USER ROUTE ***********

app.put("/removeUser", (req, res) => {
  var username = req.body.username;
  console.log(username);
  User.deleteOne({ username: username })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
