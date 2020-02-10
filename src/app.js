require("dotenv").config();

const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");

const User = require('./models/users_model');
const Categories = require('./models/categories_model');
const Posts = require('./models/posts_model');

mongoose.connect(config.connectionString, {useNewUrlParser: true});

const app = express();

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};

app.use(cors(corsOption));
app.use(bodyParse.json());
app.use(morgan('dev'));
app.use(bodyParse.urlencoded({extended: false}));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) return res.status(400).send(JSON.stringify({
      error: "Invalid JSON"
  }))
  console.error(err);
  res.status(500).send();
});

app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

const indexRoutes = require('./routes/index_routes');
const usersRoutes = require('./routes/users_routes');
const postsRoutes = require('./routes/posts_routes');

app.use('/api/v1/', indexRoutes);
app.use('/api/v1/', usersRoutes);
app.use('/api/v1/', postsRoutes);

module.exports = app; 