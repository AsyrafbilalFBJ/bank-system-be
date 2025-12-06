const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,PUT,POST,DELETE",
  }),
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bank Saving System API' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
