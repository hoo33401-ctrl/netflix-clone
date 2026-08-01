const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase, User, Movie } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const GLOBAL_BLOCKLIST = ['إباحي', 'شذوذ', 'pride', 'lgbtq', 'xxx', 'porn'];

app.post('/api/auth/signup', async (req, res) => {
  await connectToDatabase();
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });
  const token = jwt.sign({ userId: user._id }, 'secret');
  res.status(201).json({ token, user });
});

app.get('/api/movies', async (req, res) => {
  await connectToDatabase();
  const filter = { isBlocked: false };
  if (req.query.isKidsProfile === 'true') filter.isAdult = false;
  const movies = await Movie.find(filter).limit(50);
  res.json(movies);
});

module.exports.handler = async (event, context) => serverless(app)(event, context);
