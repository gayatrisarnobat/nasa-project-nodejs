const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      await request(app).get('/v1/launches').expect('Content-Type', /json/).expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      launchDate: 'January 4, 2030',
      mission: 'Hello Earth',
      rocket: 'Chandrayaan',
      target: 'Kepler-1652 b',
    };

    const launchDataWithoutDate = {
      mission: 'Hello Earth',
      rocket: 'Chandrayaan',
      target: 'Kepler-1652 b',
    };

    test('It should respond with 201 success', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toEqual(responseDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: 'Missing required launch properties' });
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send({
          launchDate: 'Hola Invalid Date',
          mission: 'Hello Earth',
          rocket: 'Chandrayaan',
          target: 'Kepler-1652 b',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: 'Invalid launch date' });
    });
  });
})
