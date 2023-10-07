const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

// dynamic multiple routes
// const whitelist = ['http://localhost:3000', 'http://localhost:8000', 'localhost:8000'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log('origin: ~~~~~~~', origin);
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// cors
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

// logging
app.use(morgan('combined'));

// json data and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// routers
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
