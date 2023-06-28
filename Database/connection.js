const mongoose = require("mongoose");


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


