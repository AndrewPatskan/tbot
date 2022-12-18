const http = require('node:http');

const { config: { HOST, PORT } } = require('./config');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  return res.end('hi');
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});