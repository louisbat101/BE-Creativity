const http = require('http');

const postData = JSON.stringify({
  password: 'admin123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/admin-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  console.log(`STATUS: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('RESPONSE:', data);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`PROBLEM with request: ${e.message}`);
  process.exit(1);
});

req.write(postData);
req.end();
