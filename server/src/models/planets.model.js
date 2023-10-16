const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 && // amount of light lower limit
    planet['koi_insol'] < 1.11 && // amout of light upper limit
    planet['koi_prad'] < 1.6 // radius
  );
};

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data/planets-data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habilatble planets found!`);
        resolve();
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getAllPlanets = async () => {
  return await planets.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
};

const savePlanet = async (data) => {
  try {
    // insert + update = upsert
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      {
        keplerName: data.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
