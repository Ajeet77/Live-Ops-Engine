const express = require("express");
const mongoose = require("mongoose");
const bodyparse = require("body-parser");
const PORT = process.env.PORT || 8080;
const app = express();
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
mongoose
  .connect("mongodb://localhost:27017/user")
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("connection fail");
  });
app.use(bodyparse.json());
app.listen(PORT, () => {
  console.log("server started at" + PORT);
});
app.use("/user", userRoutes);
app.use("/offer", offerRoutes);
