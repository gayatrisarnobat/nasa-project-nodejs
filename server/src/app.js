const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/apis/v1');

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
app.use('/v1', api);
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
