const express = require('express');

const router = express.Router();

const { userService } = require('./services/user.service');

router.post('/message', async (req, res, next) => {
  try {
    const { body } = req;

    console.log(body)

    if (body.message?.text.includes('start')) {
      await userService.initBot(body);

      return res.end();
    }

    if (body.message?.text.includes('stop')) {
      await userService.stopBot(body);

      return res.end();
    }

    await userService.startBot(body);

    return res.end();
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