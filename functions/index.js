// 'use strict';

// const functions = require('firebase-functions');
// const request = require('request');
// const cors = require('cors')({ origin: true });

// const cleanMediumJson = feed => feed.replace('])}while(1);</x>', '')

// exports.medium = functions.https.onRequest((req, res) => {
//   // Forbidding PUT requests.
//   if (req.method === 'PUT') {
//     return res.status(403).send('Forbidden!');
//   }
  
// // This isn't actually doing anything, just reutrning the cors object!

//   // Enable CORS using the `cors` express middleware.
//   return cors(req, res, () => {
//     const url = `https://medium.com/@peter.j.watters/latest?format=json`;  
//     const result = request.get(url,(error, response, body) => {
//       return JSON.parse(cleanMediumJson(body));
//     });  
   

//     res.status(200).send(result);
//   });  
// });

// 'use strict';

// const functions = require('firebase-functions');
// const express = require('express');
// const cors = require('cors')({origin: true});
// const app = express();

// app.use(cors);
// app.get('/medium', (req, res) => {
//   res.send(`Hello ${req.user.name}`);
// });

// exports.app = functions.https.onRequest(app);

'use strict';

// [START import]
const functions = require('firebase-functions');
const express = require('express');
const app = express();
// [END import]

// [START middleware]
const cors = require('cors')({origin: true});
app.use(cors);
// [END middleware]

app.get('/medium', (req, res) => {
  // Return success response
  return res.status(200).json({"message":"Hello there... Welcome to mock server."});
});
// Define the Firebase function that will act as Express application
// Note: This `api` must match with `/firebase.json` rewrites rule.
exports.api = functions.https.onRequest(app);