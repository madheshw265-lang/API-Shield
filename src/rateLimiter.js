const buckets = new Map();

const MAX_TOKENS = 5;
const REFILL_RATE = 1;
const REFILL_INTERVAL = 1000; // 1 second

function rateLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    let bucket = buckets.get(ip);

    // Create a new bucket for this IP
    if (!bucket) {
        bucket = {
            tokens: MAX_TOKENS,
            lastRefill: now
        };

        buckets.set(ip, bucket);
    }

    // Calculate how much time has passed
    const elapsedTime = now - bucket.lastRefill;

    // Add new tokens
    const tokensToAdd =
        Math.floor(elapsedTime / REFILL_INTERVAL) * REFILL_RATE;

    if (tokensToAdd > 0) {
        bucket.tokens = Math.min(
            MAX_TOKENS,
            bucket.tokens + tokensToAdd
        );

        bucket.lastRefill = now;
    }

    // No token available
    if (bucket.tokens < 1) {
        return res.status(429).json({
            error: "Too Many Requests",
            message: "Rate limit exceeded. Please try again later."
        });
    }

    // Use one token
    bucket.tokens--;

    // Send rate-limit information
    res.setHeader("X-RateLimit-Limit", MAX_TOKENS);
    res.setHeader("X-RateLimit-Remaining", bucket.tokens);

    next();
}

module.exports = rateLimiter;