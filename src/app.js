const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const { errorHandler } = require('./middlewares/errorHandler');
const dotenv = require('dotenv');
const routes = require('./routes');
const app = express();

dotenv.config();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/', routes);

module.exports = app;