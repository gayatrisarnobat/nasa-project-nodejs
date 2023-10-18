const axios = require('axios');
const launchesDb = require('./launches.mongo');
const planetsDb = require('./planets.mongo');
const { getPagination } = require('../services/query');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const saveLaunch = async (launch) => {
  await launchesDb.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDb
    .findOne({})
    .sort('-flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
};

const findLaunch = async (filter) => {
  return await launchesDb.findOne(filter);
}

const existsWithLaunchId = async (flightNumber) => {
  return await findLaunch({
    flightNumber,
  });
};

const populateLaunches = async () => {
  console.log('Downloading launch data from SpaceX API...')
  const response = await axios.post(SPACE_X_API_URL, {
    "query": {},
    "options": {
      "pagination": false,
      "populate": [
        {
          "path": "rocket",
          "select": {
            "name": 1
          }
        },
        {
          "path": "payloads",
          "select": {
            "customers": 1
          }
        }
      ]
    }
  })

  if (response?.status !== 200) {
    console.log('Problem downloading launch data from Space-X');
    throw new Error('Launch data download failed.')
  }

  response?.data?.docs.forEach(async launchDoc => {
    const payloads = launchDoc.payloads;
    const mapPayloads = (payloads) => payloads.customers;
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: new Date(launchDoc.date_local),
      upcoming: launchDoc.upcoming,
      success: launchDoc.success, // success in space-x
      customers: payloads.flatMap(mapPayloads), // payload.customers for each payload in space-x
    }
    await saveLaunch(launch);
  })
}

const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  })
  if (firstLaunch) {
    console.log('Launch data was already loaded');
  } else {
    await populateLaunches();
  }
}

const getAllLaunches = async (query) => {
  const { skip, limit } = getPagination(query)
  return await launchesDb.find({}, {
    __v: 0,
    _id: 0,
  })
    .sort({ flightNumber: 1 }) // ascending
    .skip(skip)
    .limit(limit);
};

const createNewLaunch = async (launch) => {
  const planet = await planetsDb.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found')
  }

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
  const aborted = await launchesDb.updateOne({
    flightNumber,
  }, {
    upcoming: false,
    success: false,
  });
  return aborted.modifiedCount === 1;
};

module.exports = {
  existsWithLaunchId,
  loadLaunchData,
  getAllLaunches,
  createNewLaunch,
  abortLaunch,
};
