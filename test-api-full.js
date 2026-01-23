const http = require('http');

// Test 1: Health check
const healthTest = () => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(' Health check:', JSON.parse(data).status);
      productsTest();
    });
  });
  
  req.on('error', (e) => console.error(' Health failed:', e.message));
  req.end();
};

// Test 2: Get products
const productsTest = () => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/products',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      const products = JSON.parse(data);
      console.log(' Products loaded:', products.length, 'items');
      console.log('  Sample:', products[0]?.name);
      process.exit(0);
    });
  });
  
  req.on('error', (e) => {
    console.error(' Products failed:', e.message);
    process.exit(1);
  });
  req.end();
};

healthTest();
