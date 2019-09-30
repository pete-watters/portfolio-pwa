const functions = require('firebase-functions');
var request = require('request');
// const myUser = '@peter.j.watters';

// Add CORS to your index.js
const cors = require('cors')({origin: true});

exports.medium = functions.https.onRequest((req, res) => {
  if(!req.query.username) {
    return res.status(400).send('Error: You need to include query param ?username=@yourUsername');
  }  
  // Put this line to your function
  // Automatically allow cross-origin requests
  cors(req, res, () => {});
    const url = `https://medium.com/@peter.j.watters/latest?format=json`;  
    return request(url,(error, response, body) => {
    const prefix = `])}while(1);</x>`;
    const strip = payload => payload.replace(prefix, ``);
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    res.send(JSON.parse(strip(body)));
  });
})