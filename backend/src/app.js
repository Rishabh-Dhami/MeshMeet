const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require("cors");

dotenv.config();
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to MeshMeet backend");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

module.exports = {app};