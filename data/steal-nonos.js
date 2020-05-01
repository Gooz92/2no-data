const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

function fetch(id) {
  const data = querystring.stringify({ id });
  const notExistsResponse = `Puzzle ${id} does not exist\n`;

  const req = https.request({
    hostname: 'webpbn.com',
    path: '/XMLpuz.cgi',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
  
    res.on('data', (d) => {
      const str = d.toString();

      if (notExistsResponse === str) {
        console.log('not found: ' + str);
      } else {
        fs.writeFile(`./data/webpbn/${id}.xml`, d, { flag: 'a' }, function (err) {
          if(err) {
              return console.log(err);
          }
      
          console.log(`The file was saved: ${id}`);
      });
      }
    });
  });

  req.on('error', (e) => {
    console.error('ERROR: ' + e);
  });

  req.write(data);
  req.end();

  return req;
}

let id = 0;
const stop = 33000;

function run(id) {

  fetch(id).on('close', () => {
    if (id < stop) run(id + 1);
  });
}

run(id);

