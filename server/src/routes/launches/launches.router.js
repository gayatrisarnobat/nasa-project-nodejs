const express = require('express');
const { httpGetAllLaunches, httpCreateNewLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpCreateNewLaunch);

module.exports = launchesRouter;
