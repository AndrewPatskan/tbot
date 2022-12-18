const { config: { HOST, PORT } } = require('./config');

const app = require('./app');

(async () => {
  const server = await app();

  server.listen(PORT, HOST, () => {
    console.log(`Server running at ${HOST}:${PORT}`);
  });
})();