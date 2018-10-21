"use strict";

const UrlEntries = require("../models/urlEntries");
const dns = require("dns");
const shortid = require("shortid");

const protocolRegExp = /^https?:\/\/(.*)/i;
const hostnameRegExp = /^([a-z0-9\-_]+\.)+[a-z0-9\-_]+/i;
const forwardSlashRegexp = /\/$/i;

exports.addUrl = (req, res) => {
  let url = req.body.url;

  if (url.match(forwardSlashRegexp)) {
    url = url.slice(0, -1);
  }

  let protocolMatch = url.match(protocolRegExp);
  if (!protocolMatch) {
    return res.json({"error": "invalid URL"});
  }

  let hostAndQuery = protocolMatch[1];
  let hostnameMatch = hostAndQuery.match(hostnameRegExp);

  if (hostnameMatch) {
    dns.lookup(hostnameMatch[0], (err) => {
      if (err) {
        res.json({"error": "invalid Hostname"});
      } else {
        let convertedLink = Buffer.from(url).toString("base64");
        UrlEntries.findOne({ "url": convertedLink }, (err, data) => {
          if (err) return;
          if (data) {
            res.json({"original_url": url, "short_url": data.short});
          } else {
            let shortLink = shortid.generate();
            const newLink = new UrlEntries({
              "url": convertedLink, 
              "short": shortLink 
            });
            newLink.save((err, data) => {
              if (err) return; 
              res.json({"original_url":  url, "short_url": shortLink});
            })
          }
        })
      }
    });
  } else {
    res.json({"error": "invalid URL" });
  }
}

exports.checkUrl = (req, res) => {
  const hashurl = req.params.hashurl;
  UrlEntries.findOne({ "short": hashurl }, (err, data) => {
    if (err) return;
    if (data) {
      const trueUrl = Buffer.from(data.url, "base64").toString("utf8");
      res.redirect(trueUrl);
    } else {
      res.json({"error": "No shorturl found"});
    }
  })
}

