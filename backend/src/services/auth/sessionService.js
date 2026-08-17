const { redisClient } = require('../../config/redis');

const hashToken = require('../../utils/auth/hashToken');

const storeRefreshSession = async (userId, refreshToken) => {
  const hashedRefreshToken = hashToken(refreshToken);

  await redisClient.set(`refreshToken:${userId}`, hashedRefreshToken, {
    EX: Number(process.env.REDIS_REFRESH_SESSION_EXPIRY_SECONDS),
  });
};

const getRefreshSession = async (userId) => {
  return await redisClient.get(`refreshToken:${userId}`);
};

const removeRefreshSession = async (userId) => {
  await redisClient.del(`refreshToken:${userId}`);
};

module.exports = {
  storeRefreshSession,
  getRefreshSession,
  removeRefreshSession,
};
