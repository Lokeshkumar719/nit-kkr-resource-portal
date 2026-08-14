require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const {redisClient,connectRedis } = require('./config/redis');

const authRoutes = require('./routes/authRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
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

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NIT KKR Student Portal API Running',
  });
});

// Routes
app.use('/api/auth', authRoutes);

// Error Middleware
app.use(errorMiddleware);

// Graceful Shutdown
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
    await Promise.all([
      connectDB(),
      connectRedis(),
    ]);

    console.log('Database Connected');

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on port ${process.env.PORT}`
      );
    });
  } catch (error) {
    console.error('Startup Error:', error);
  }
};

initialiseConnection();