require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouters = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// ✅ Allowed origins — exact matches for localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// ✅ Pattern to allow ALL Vercel deployments (production + preview) for this project
const allowedVercelPattern = /^https:\/\/.*iamharshitsharma518-5075s-projects\.vercel\.app$/;

// ✅ FIXED CORS CONFIG
app.use(cors({
  origin: function (origin, callback) {
    console.log("Incoming origin:", origin);

    // Allow requests with no origin (Postman, mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Allow localhost
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Vercel deployment URL for this project
    if (allowedVercelPattern.test(origin)) {
      return callback(null, true);
    }

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