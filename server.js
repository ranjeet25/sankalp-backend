const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");


app.use(express.json());

// ******* CORS CONFUGUARATION ***********
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
  })
  .catch((err) => {
    console.error("Database connection error");
  });


// ******* REGISTER ROUTE ***********

const user_registration = require("./Routes/registration")
const user_model = require("./Model/register")
app.use("/", user_registration);

// ******* REGISTER ROUTE ENDS ***********


// ******* UPDATE PROFILE **************

app.post("/update", (req, res) => {
  var data = req.body;

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

// ******* UPDATE PROFILE ENDS **************



// ******* LOGIN ROUTE ***********

var uid;
app.post("/login",  async (req, res) => {
  var uname = req.body.uname;
  var password = req.body.pass;

  
  user_model.findOne({ username: uname })

    .then((doc) => {

      if (uname == "admin" && password == "admin@1234") {
        res.sendStatus(201);
      }

      else if (uname == "resolver" && password == "resolver@1234") {
        res.sendStatus(202);
      }

      else if (doc == null) {
        res.sendStatus(300);
      }

      else  if (doc.password === password) {
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


// ******* LOGIN ROUTE ENDS ***********


// ******* complaints ROUTE ***********


var complaintsData;

const Complaint_model = require("./Model/complaint")
const Complaint = require("./Routes/complaints")
app.use("/", Complaint);



// Admin complaint delete ROUTE
// Very Dangourus

app.get("/delete", (req, res) => {
  User.deleteMany({ "": "" }).then((data) => res.send(data));
});

app.post("/delete/:id", (req, res) => {
  
  const userid = req.params.id;

  Complaint_model.deleteOne({ _id: userid }).then((data) => {
    console.log(data);
  });

});

// ******* ADMIN ROUTE ***********

app.get("/admin", (req, res) => {

  Complaint_model.find()
    .then((data) => {
      complaintsData = data;
      res.send(complaintsData);
    })
    .catch((err) => console.log(err));

});

// ******* ADMIN ROUTE ENDS ***********

// ******* RESOLVER ROUTE ***********

var userId = new Array();

app.post("/resolver/:id", (req, res) => {
  const userid = req.params.id;
  Complaint_model.findOne({ _id: userid }).then((data) => {
    userId.push(data);
  });

});

// --------- REMOVE USER ROUTE ---------

app.put("/removeUser", (req, res) => {
  var username = req.body.username;
  console.log(username);
  User.deleteOne({ username: username })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
});

// ******* RESOLVER ROUTE ENDS ***********



// ******* STUDENT FEEDBACK  ***********
app.put("/studentFeedback", (req, res) => {
  var complaintID = req.body.complaintID;
  var studentSatisfaction = req.body.studentSatisfaction;
  var studentFeedback = req.body.studentFeedback;
  

  var data;
  Complaint_model.findOneAndUpdate(
    { _id: complaintID },
    {
      studentSatisfaction: studentSatisfaction,
      studentFeedback: studentFeedback,
    },
    { new: true }
  )
    .then((result) => {
      data = result;
      userId.push(data);
    })
    .catch((err) => console.log(err));
});

app.get("/resolver", (req, res) => {
  res.send(userId);
});

// ******* STUDENT HISTORY  ROUTE ***********

app.get("/history", (req, res) => {
  Complaint_model.find({ uid: uid })
    .then((data) => {
      complaintsData = data;
      complaintsData;
      res.send(complaintsData);
    })
    .catch((err) => console.log(err));
});



// ******* SERVER CONFIGUARATION ***********

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
