const { CronJob } = require('cron');

const { service: { updateScheduleCJ, sendNewScheduleCJ } } = require('./service');

module.exports.cronJobs = () => {
  const cron1 = new CronJob('0 0 * * *', async () => {
    try {
      await updateScheduleCJ();
    } catch (e) {
      console.error(e);
    }
  });

  cron1.start();

  const cron2 = new CronJob('0 0 * * *', async () => {
    try {
      await sendNewScheduleCJ();
    } catch (e) {
      console.error(e);
    }
  });

  cron2.start();
};
