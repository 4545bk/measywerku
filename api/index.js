import app from '../server/server.js';

// Vercel serverless function handler with error handling
export default async (req, res) => {
    try {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

        // Handle OPTIONS request
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        // Let Express handle the request
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
