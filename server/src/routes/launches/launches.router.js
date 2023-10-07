const express = require('express');
const {
  httpGetAllLaunches,
  httpCreateNewLaunch,
  httpDeleteLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpCreateNewLaunch);
launchesRouter.delete('/:flightNumber', httpDeleteLaunch);

module.exports = launchesRouter;
