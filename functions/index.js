'use strict';

const functions = require('firebase-functions');
const request = require('request');
const cors = require('cors')({ origin: true });

const cleanMediumJson = feed => feed.replace('])}while(1);</x>', '')

exports.medium = functions.https.onRequest((req, res) => {
  // Forbidding PUT requests.
  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }
  
// This isn't actually doing anything, just reutrning the cors object!

  // Enable CORS using the `cors` express middleware.
  return cors(req, res, () => {
    const url = `https://medium.com/@peter.j.watters/latest?format=json`;  
    const result = request.get(url,(error, response, body) => {
      return JSON.parse(cleanMediumJson(body));
    });  
   

    res.status(200).send(result);
  });  
});

// Try this: https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js