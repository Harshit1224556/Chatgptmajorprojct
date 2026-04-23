const cron = require('node-cron');
const https = require('https');

const BACKEND_URL = process.env.BACKEND_URL || 'https://chatgptmajorprojct.onrender.com';

/**
 * Pings the backend's health endpoint to keep Render free tier awake.
 * Render spins down services after 15 minutes of inactivity.
 * This job runs every 14 minutes to prevent that.
 */
function startKeepAlive() {
  // Run every 14 minutes: "*/14 * * * *"
  cron.schedule('*/14 * * * *', () => {
    const timestamp = new Date().toISOString();
    console.log(`[CRON] Keep-alive ping sent at ${timestamp}`);

    https.get(BACKEND_URL, (res) => {
      console.log(`[CRON] Ping response: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[CRON] Ping failed: ${err.message}`);
    });
  });

  console.log('[CRON] Keep-alive scheduler started — pinging every 14 minutes');
}

module.exports = startKeepAlive;
