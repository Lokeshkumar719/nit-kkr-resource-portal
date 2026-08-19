export const parseRateLimitError = (error) => {
  if (error?.response?.status === 429) {
    const data = error.response.data;
    const headers = error.response.headers;

    // Prefer retryAfterSeconds from body, fallback to Retry-After header
    let retryAfterSeconds = data?.retryAfterSeconds || headers?.['retry-after'];

    if (retryAfterSeconds) {
      return {
        isRateLimited: true,
        retryAfterSeconds: parseInt(retryAfterSeconds, 10),
      };
    }
  }

  return { isRateLimited: false, retryAfterSeconds: null };
};

export const formatCountdown = (seconds) => {
  if (seconds <= 0) return '';

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
};
