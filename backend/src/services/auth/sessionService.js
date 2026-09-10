const jwt = require('jsonwebtoken');

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

const blacklistAccessToken = async (accessToken) => {
  const hashedToken = hashToken(accessToken);

  // Decode without verifying — we just need the `exp` claim for TTL.
  // The token was already verified in authMiddleware before reaching here.
  const decoded = jwt.decode(accessToken);

  if (!decoded || !decoded.exp) {
    return;
  }

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);

  // If the token is already expired, no need to blacklist it.
  if (ttl <= 0) {
    return;
  }

  await redisClient.set(`blacklist:${hashedToken}`, '1', { EX: ttl });
};

const isAccessTokenBlacklisted = async (accessToken) => {
  const hashedToken = hashToken(accessToken);
  const result = await redisClient.get(`blacklist:${hashedToken}`);
  return result !== null;
};

module.exports = {
  storeRefreshSession,
  getRefreshSession,
  removeRefreshSession,
  blacklistAccessToken,
  isAccessTokenBlacklisted,
};
