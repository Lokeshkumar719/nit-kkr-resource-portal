require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const { redisClient, connectRedis } = require('./config/redis');

const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const bugRoutes = require('./routes/bugRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5175',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

app.use(cookieParser());

// Prevent caching for all API routes (Cloudflare, browser, etc.)
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NIT KKR Student Portal API Running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/bugs', bugRoutes);

app.use(errorMiddleware);

process.on('SIGINT', async () => {
  try {
    await redisClient.quit();
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
});

const initialiseConnection = async () => {
  try {
    await Promise.all([connectDB(), connectRedis()]);

    console.log('Database Connected');

    const setupCronJobs = require('./utils/cronJobs');
    setupCronJobs();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Startup Error:', error);
  }
};

initialiseConnection();
