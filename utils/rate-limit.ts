const rateMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 60, windowSeconds = 60) {
  const now = Date.now();
  const record = rateMap.get(key) ?? { count: 0, resetAt: now + windowSeconds * 1000 };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowSeconds * 1000;
  }

  record.count += 1;
  rateMap.set(key, record);

  if (record.count > limit) {
    return {
      allowed: false,
      resetAt: record.resetAt,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  };
}
