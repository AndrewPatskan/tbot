const express = require('express');

const router = express.Router();

const { service } = require('./service');

router.post('/message', async (req, res, next) => {
  try {
    const { body } = req;

    console.log(body)

    if (body.message?.text.includes('start')) {
      await service.initBot(body);

      return res.end();
    }

    if (!body.message?.text || body.message.text.includes('stop')) {
      await service.stopBot(body);

      return res.end();
    }

    await service.startBot(body);

    return res.end();
  } catch (e) {
    return next(e);
  }
});

router.get('/update-shedule-nqCeEWdsds6*&dshjsd', async (req, res, next) => {
  try {
    await service.updateScheduleCJ();
  } catch (e) {
    return next(e);
  }
});

router.use((req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

router.use((err, req, res, next) => {
  console.log(err);

  return res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;