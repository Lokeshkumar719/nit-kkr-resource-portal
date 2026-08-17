const { RateLimiterRedis } = require('rate-limiter-flexible');
const { redisClient } = require('../config/redis');
const {
  LOGIN_LIMIT,
  LOGIN_DURATION,
  CHANGE_PASSWORD_LIMIT,
  CHANGE_PASSWORD_DURATION,
  FORGOT_PASSWORD_LIMIT,
  FORGOT_PASSWORD_DURATION,
  RESEND_OTP_LIMIT,
  RESEND_OTP_DURATION,
  REGISTER_LIMIT,
  REGISTER_DURATION,
  RESOURCE_LIMIT,
  RESOURCE_REFILL_RATE_PER_SEC,
  CONTRIBUTION_LIMIT,
  CONTRIBUTION_REFILL_RATE_PER_SEC,
} = require('../constants/rateLimiterConstants');

const {TOO_MANY_REQUEST} = require("../constants/statusCodes");

const buildHeaders = (limit, remaining, retryAfterMs = null) => {
  const headers = {
    'X-RateLimit-Limit': limit,
    'X-RateLimit-Remaining': Math.max(0, Math.floor(remaining)),
  };
  if (retryAfterMs !== null) {
    headers['Retry-After'] = Math.ceil(retryAfterMs / 1000) || 1;
  }
  return headers;
};

const tooManyRequests = (res, limit, retryAfterMs) => {
  const headers = buildHeaders(limit, 0, retryAfterMs);
  res.set(headers);
  return res.status(TOO_MANY_REQUEST).json({
    success: false,
    message: 'Too many requests. Please slow down.',
    retryAfterSeconds: headers['Retry-After'],
  });
};

const TOKEN_BUCKET_LUA = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2]) -- tokens per millisecond
local now = tonumber(ARGV[3])         -- current timestamp in ms
local requested = tonumber(ARGV[4])   -- normally 1

local bucket = redis.call("HMGET", key, "tokens", "last_refill")
local tokens = tonumber(bucket[1])
local last_refill = tonumber(bucket[2])

if not tokens then
  tokens = capacity
  last_refill = now
else
  local elapsed = math.max(0, now - last_refill)
  local refill = elapsed * refill_rate
  tokens = math.min(capacity, tokens + refill)
  last_refill = now
end

if tokens >= requested then
  tokens = tokens - requested
  redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
  return {1, tokens, 0}
else
  redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
  local wait_ms = math.ceil((requested - tokens) / refill_rate)
  return {0, tokens, wait_ms}
end
`;

const consumeTokenBucket = async (key, capacity, refillRatePerSec) => {
  const now = Date.now();
  const refillRatePerMs = refillRatePerSec / 1000;
  const requested = 1;

  const [allowed, remaining, waitMs] = await redisClient.eval(TOKEN_BUCKET_LUA, {
    keys: [key],
    arguments: [
      capacity.toString(),
      refillRatePerMs.toString(),
      now.toString(),
      requested.toString(),
    ],
  });

  return {
    allowed: allowed === 1,
    remaining: Math.max(0, remaining),
    waitMs,
  };
};

const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: 'rl:login',
  points: LOGIN_LIMIT,
  duration: LOGIN_DURATION,
});

const changePasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: 'rl:change-password',
  points: CHANGE_PASSWORD_LIMIT,
  duration: CHANGE_PASSWORD_DURATION,
});

const forgotPasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: 'rl:forgot-password',
  points: FORGOT_PASSWORD_LIMIT,
  duration: FORGOT_PASSWORD_DURATION,
});

const resendOtpLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: 'rl:resend-otp',
  points: RESEND_OTP_LIMIT,
  duration: RESEND_OTP_DURATION,
});

const registerLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: 'rl:register',
  points: REGISTER_LIMIT,
  duration: REGISTER_DURATION,
});

const limitResource = async (req, res, next) => {
  const key = `rl:resource:${req.user._id.toString()}`;

  try {
    const { allowed, remaining, waitMs } = await consumeTokenBucket(
      key,
      RESOURCE_LIMIT,
      RESOURCE_REFILL_RATE_PER_SEC
    );

    res.set(buildHeaders(RESOURCE_LIMIT, remaining));

    if (allowed) {
      return next();
    }

    return tooManyRequests(res, RESOURCE_LIMIT, waitMs);
  } catch (error) {
    // Fail-open: Redis being down must not block users from running code.
    console.error('[rateLimitMiddleware] limitResource unexpected error:', error);
    return next();
  }
};

const limitContribution = async (req, res, next) => {
  const key = `rl:contribution:${req.user._id.toString()}`;

  try {
    const { allowed, remaining, waitMs } = await consumeTokenBucket(
      key,
      CONTRIBUTION_LIMIT,
      CONTRIBUTION_REFILL_RATE_PER_SEC
    );

    res.set(buildHeaders(CONTRIBUTION_LIMIT, remaining));

    if (allowed) {
      return next();
    }

    return tooManyRequests(res, CONTRIBUTION_LIMIT, waitMs);
  } catch (error) {
    // Fail-open: Redis being down must not block users from submitting code.
    console.error('[rateLimitMiddleware] limitContribution unexpected error:', error);
    return next();
  }
};

const limitLogin = async (req, res, next) => {
  const key = req.ip;

  try {
    const result = await loginLimiter.consume(key);
    res.set(buildHeaders(LOGIN_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error('[rateLimitMiddleware] loginLimiter unexpected error:', rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, LOGIN_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

const limitChangePassword = async (req, res, next) => {
  const key = req.user._id.toString(); // ← authenticated user, not IP
  try {
    const result = await changePasswordLimiter.consume(key);
    res.set(buildHeaders(CHANGE_PASSWORD_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error('[rateLimitMiddleware] changePasswordLimiter error:', rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, CHANGE_PASSWORD_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

const limitForgotPassword = async (req, res, next) => {
  const key = req.ip; // usually rate limit by IP for unauthenticated routes
  try {
    const result = await forgotPasswordLimiter.consume(key);
    res.set(buildHeaders(FORGOT_PASSWORD_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error('[rateLimitMiddleware] forgotPasswordLimiter error:', rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, FORGOT_PASSWORD_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

const limitResendOtp = async (req, res, next) => {
  const key = req.ip; // usually rate limit by IP for unauthenticated routes
  try {
    const result = await resendOtpLimiter.consume(key);
    res.set(buildHeaders(RESEND_OTP_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error('[rateLimitMiddleware] resendOtpLimiter error:', rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, RESEND_OTP_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

const limitRegister = async (req, res, next) => {
  const key = req.ip;

  try {
    const result = await registerLimiter.consume(key);
    res.set(buildHeaders(REGISTER_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error('[rateLimitMiddleware] registerLimiter unexpected error:', rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, REGISTER_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

module.exports = {
  limitResource,
  limitContribution,
  limitLogin,
  limitRegister,
  limitChangePassword,
  limitForgotPassword,
  limitResendOtp
};