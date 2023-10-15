const launchesDb = require('./launches.mongo');
const planetsDb = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['NASA', 'ZTM'],
  upcoming: true,
  success: true,
};

const saveLaunch = async (launch) => {
  const planet = await planetsDb.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error('No matching planet found')
  }
  await launchesDb.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
};

saveLaunch(launch);

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDb
    .findOne({})
    .sort('-flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
};

const existsWithLaunchId = async (flightNumber) => {
  return await launchesDb.findOne({
    flightNumber,
  });
};

const getAllLaunches = async () => {
  return await launchesDb.find({}, {
    __v: 0,
    _id: 0,
  })
};

const createNewLaunch = async (launch) => {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);
  return newLaunch;
};

const abortLaunch = async (flightNumber) => {
  const aborted = await launchesDb.findOne({
    flightNumber,
  });
  aborted.upcoming = false;
  aborted.success = false;
  aborted.isNew = false;
  await saveLaunch(aborted);
  return aborted;
};

module.exports = {
  existsWithLaunchId,
  getAllLaunches,
  createNewLaunch,
  abortLaunch,
};
