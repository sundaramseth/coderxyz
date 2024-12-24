import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    // Extract the Authorization header
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1]; // Extract the token
    console.log('Extracted token:', token);

    if (!token) {
        return next(errorHandler(401, 'Unauthorized - Token Missing'));
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return next(errorHandler(401, 'Unauthorized - Invalid Token'));
        }
        req.user = user; // Attach user data to the request object
        next();
    });
};
