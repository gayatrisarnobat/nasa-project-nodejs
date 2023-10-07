const {
  getAllLaunches,
  createNewLaunch,
  abortLaunch,
  existsWithLaunchId,
} = require('../../models/launches.model');

const httpGetAllLaunches = (req, res) => {
  return res.status(200).json(getAllLaunches());
};

const httpCreateNewLaunch = (req, res) => {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({ error: 'Missing required launch properties' });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }
  return res.status(201).json(createNewLaunch(launch));
};

const httpDeleteLaunch = (req, res) => {
  const launchId = +req.params.flightNumber;
  if (!existsWithLaunchId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  const aborted = abortLaunch(launchId);
  return res.status(200).json(aborted);
};

module.exports = {
  httpGetAllLaunches,
  httpCreateNewLaunch,
  httpDeleteLaunch,
};
