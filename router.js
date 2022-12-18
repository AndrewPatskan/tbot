const express = require('express');

const router = express.Router();

router.post('/message', async (req, res, next) => {
  try {
    const { body } = req;

    console.log(body);

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