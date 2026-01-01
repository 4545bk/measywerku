import app from '../server/server.js';

// Vercel serverless function handler
export default async (req, res) => {
    // Let Express handle the request
    return app(req, res);
};

