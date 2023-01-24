const { config: { HOST, PORT } } = require('./config');

const app = require('./app');

const { cronJobs } = require('./cron');

const { service } = require('./service');

app.listen(PORT, HOST, (e) => {
  if (e) {
    console.log(e);

    process.exit(1);
  }

  console.log(`Server running at ${HOST}:${PORT}`);

  cronJobs();

  // service.updateScheduleCJ();
});
