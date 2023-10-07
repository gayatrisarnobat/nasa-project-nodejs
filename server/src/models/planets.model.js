const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

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
    fs.createReadStream(path.join(__dirname, '..', '..', 'data/planets-data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on('end', () => {
        console.log(`${habitablePlanets.length} habilatble planets found!`);
        resolve();
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getAllPlanets = () => {
  return habitablePlanets;
};

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
