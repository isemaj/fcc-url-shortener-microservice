const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongo = require("mongodb");

const urlHandler = require("./controllers/urlHandler.js");

const MongoClient = mongo.MongoClient;

const PORT = process.env.PORT || 9000;

const connectOption= {
  useNewUrlParser: true,
};

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require("dotenv").config();
}

// check the dbpath in /etc/mongodb.conf
const mongoURI = process.env.NODE_ENV !== "production" ? `${process.env.MONGODB_URI}${process.env.DB}` : process.env.MONGODB_URI;
mongoose.connect(mongoURI, connectOption);

app.use(cors());
app.use(bodyParser.urlencoded({"extended": false}));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.post("/api/shorturl/new", urlHandler.addUrl);
app.get("/api/shorturl/:hashurl", urlHandler.checkUrl)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})