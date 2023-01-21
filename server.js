const { config: { HOST, PORT } } = require('./config');

const app = require('./app');

app.listen(PORT, HOST, (e) => {
  if (e) {
    console.log(e);

    process.exit(1);
  }

  console.log(`Server running at ${HOST}:${PORT}`);
});
