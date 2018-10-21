const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const PORT = process.env.PORT || 9000;

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require("dotenv").config();
}

// check the dbpath in /etc/mongodb.conf

app.use(cors());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})