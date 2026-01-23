const http = require('http');

http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      console.log('✓ API Health:', JSON.parse(data).status);
    } catch (e) {
      console.log('✓ API responding:', res.statusCode);
    }
    process.exit(0);
  });
}).on('error', (e) => {
  console.error('✗ Connection failed:', e.message);
  process.exit(1);
});
