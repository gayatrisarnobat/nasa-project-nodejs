const {
  getAllLaunches,
  createNewLaunch,
  abortLaunch,
  existsWithLaunchId,
} = require('../../models/launches.model');

const httpGetAllLaunches = async (req, res) => {
  return res.status(200).json(await getAllLaunches(req.query));
};

const httpCreateNewLaunch = async (req, res) => {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({ error: 'Missing required launch properties' });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }
  return res.status(201).json(await createNewLaunch(launch));
};

const httpDeleteLaunch = async (req, res) => {
  const launchId = +req.params.flightNumber;
  if (!await existsWithLaunchId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  const aborted = await abortLaunch(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted',
    })
  }
  return res.status(200).json({
    ok: true,
  });
};

module.exports = {
  httpGetAllLaunches,
  httpCreateNewLaunch,
  httpDeleteLaunch,
};
