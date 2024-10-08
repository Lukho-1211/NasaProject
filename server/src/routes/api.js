const express = require('express');

const planetsRouter = require('./planets/plantes.router');
const launchRouter = require('./launches/launches.router');

const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchRouter);


module.exports = api;