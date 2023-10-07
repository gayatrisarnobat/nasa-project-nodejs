const { getAllLaunches, createNewLaunch } = require('../../models/launches.model');

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

module.exports = {
  httpGetAllLaunches,
  httpCreateNewLaunch,
};
