const express = require('express');
const helmet = require('helmet');

const router = require('./router');

const app = express();

app.use(helmet());

app.use(express.json({ strict: false, limit: '1mb' }));

app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use(router);

module.exports = app;
