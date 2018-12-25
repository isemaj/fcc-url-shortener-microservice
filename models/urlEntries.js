"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UrlEntries  = new Schema({
  short: {type: String, required: true}, // shortid
  url: {type: String, required: true} // base64
});

module.exports = mongoose.model("UrlEntries", UrlEntries);