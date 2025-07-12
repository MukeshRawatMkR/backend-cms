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

// app.get('/', (req, res) => {
//   res.send('Welcome to the Portfolio Backend API Homepage');
// });

app.use('/', routes);


// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/blogs", require("./routes/blogRoutes"));

// Error Handler
// app.use(errorHandler);

module.exports = app;