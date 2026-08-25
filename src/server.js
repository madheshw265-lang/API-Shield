const express = require("express");
const rateLimiter = require("./rateLimiter");

const app = express();

app.use(express.json());

// API Shield rate limiter
app.use(rateLimiter);

// Health check
app.get("/", (req, res) => {
    res.json({
        name: "API Shield",
        status: "online",
        message: "API Shield is protecting this API."
    });
});

// Test endpoint
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Request allowed by API Shield."
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API Shield running at http://localhost:${PORT}`);
});