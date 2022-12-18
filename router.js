const express = require('express');

const router = express.Router();

const { telegram } = require('./adapters/telegram');

router.post('/message', async (req, res, next) => {
  try {
    const { body } = req;

    const { message } = body;

    console.log(message)

    if (message?.text.includes('start')) {
      return res.json({ text: 'Введіть назву вулиці. Наприклад: Швабська' });
    }

    await telegram.sendMessage({ chat_id: '391326164', text: 'hello buddy' });

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