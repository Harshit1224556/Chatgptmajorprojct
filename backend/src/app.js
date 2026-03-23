require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouters = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://y-nqukhwea1-iamharshitsharma518-5075s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// middlewares
app.use(express.json());
app.use(cookieParser());

// test route
app.get('/', (req, res) => {
  res.send("Backend is running ✅");
});

// routes
app.use('/api/auth', authRouters);
app.use('/api/chat', chatRoutes);

module.exports = app;