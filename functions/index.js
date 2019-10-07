'use strict';

const functions = require('firebase-functions');
const express = require('express');
const Parser = require('rss-parser');
const app = express();
const cors = require('cors')({origin: true});
app.use(cors);

app.get('/medium', async (req, res) => {
  try {
    let parser = new Parser();
    let feed = await parser.parseURL('https://medium.com/feed/@pete_watters/');
    return res.status(200).send(feed);
  } catch (error) {
    return res.status(400).send({message: `Bad news :( ${error}`});
  }
});
exports.api = functions.https.onRequest(app);