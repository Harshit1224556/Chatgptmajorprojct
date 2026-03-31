require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouters = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://y-nqukhwea1-iamharshitsharma518-5075s-projects.vercel.app'
];

// ✅ FIXED CORS CONFIG
app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming origin:", origin);

    // allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ❌ DON'T THROW ERROR → just block
    console.log("Blocked by CORS:", origin);
    return callback(null, false);
  },
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get('/', (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Routes
app.use('/api/auth', authRouters);
app.use('/api/chat', chatRoutes);

module.exports = app;