// // const functions = require('firebase-functions');
// // var request = require('request');
// // // const myUser = '@peter.j.watters';

// // // Try this - Express on Firebase
// // // https://codeburst.io/express-js-on-cloud-functions-for-firebase-86ed26f9144c


// // // Add CORS to your index.js
// // const cors = require('cors')({origin: true});

// // exports.medium = functions.https.onRequest((req, res) => {
// //   if(!req.query.username) {
// //     return res.status(400).send('Error: You need to include query param ?username=@yourUsername');
// //   }  
// //   // Put this line to your function
// //   // Automatically allow cross-origin requests
// //   cors(req, res, () => {});
// //     const url = `https://medium.com/@peter.j.watters/latest?format=json`;  
// //     return request(url,(error, response, body) => {
// //     const prefix = `])}while(1);</x>`;
// //     const strip = payload => payload.replace(prefix, ``);
// //     res.headers.set('Access-Control-Allow-Origin', '*');
// //     res.headers.set('Access-Control-Allow-Methods', 'GET, POST');
// //     res.send(JSON.parse(strip(body)));
// //   });
// // })
// const cors = require('cors');
// const express = require('express');

// // const simpleServer = express();
// // simpleServer.get('*', (request, response) => {
// //   response.send('Hello from Express on Firebase!');
// // });

// // const corsServer = express();
// // corsServer.use(cors({origin: true}));
// // corsServer.get('*', (request, response) => {
// //   response.send('Hello from Express on Firebase with CORS!');
// // });

// const cleanPathServer = express();
// cleanPathServer.use(cors({origin: true}));
// cleanPathServer.get('*', (request, response) => {
//   response.send(
//     'Hello from Express on Firebase with CORS! No trailing \'/\' required!'
//   );
// });

// module.exports = {
//   // simpleServer,
//   // corsServer,
//   cleanPathServer
// };
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// [START functionsimport]
const functions = require('firebase-functions');
// [END functionsimport]
// [START additionalimports]
// Moments library to format dates.
const moment = require('moment');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true,
});
// [END additionalimports]

// [START all]
/**
 * Returns the server's date. You must provide a `format` URL query parameter or `format` value in
 * the request body with which we'll try to format the date.
 *
 * Format must follow the Node moment library. See: http://momentjs.com/
 *
 * Example format: "MMMM Do YYYY, h:mm:ss a".
 * Example request using URL query parameters:
 *   https://us-central1-<project-id>.cloudfunctions.net/date?format=MMMM%20Do%20YYYY%2C%20h%3Amm%3Ass%20a
 * Example request using request body with cURL:
 *   curl -H 'Content-Type: application/json' /
 *        -d '{"format": "MMMM Do YYYY, h:mm:ss a"}' /
 *        https://us-central1-<project-id>.cloudfunctions.net/date
 *
 * This endpoint supports CORS.
 */

exports.medium = functions.https.onRequest((req, res) => {
  // Forbidding PUT requests.
  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }
  // Enable CORS using the `cors` express middleware.
  return cors(req, res, () => {
    const formattedDate = moment().format('MMMM%20Do%20YYYY%2C%20h%3Amm%3Ass%20a');
    console.log('Sending Formatted date:', formattedDate);
    res.status(200).send(formattedDate);
  });  
});