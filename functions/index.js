const functions = require('firebase-functions');
var request = require('request');
const myUser = '@peter.j.watters';

exports.medium = functions.https.onRequest((req, res) => {
  if(!req.query.username) {
    return res.status(400).send('Error: You need to include query param ?username=@yourUsername');
  }  
    const url = `https://medium.com/${req.query.username}/latest?format=json`;  
    return request(url,(error, response, body) => {
    const prefix = `])}while(1);</x>`
    const strip = payload => payload.replace(prefix, ``)
    res.send(JSON.parse(strip(body)));
  });
})