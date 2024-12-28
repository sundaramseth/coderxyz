import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './api/routes/users.route.js';
import authRoutes from './api/routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRoutes from './api/routes/post.route.js';
import commentRoutes from './api/routes/comment.route.js';

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MANGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDb is connected');
}).catch((err) => {
    console.error(err);
    process.exit(1); // Exit if the connection fails
});

const app = express();



// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['https://coderxyz.com', 'http://localhost:5173'], // Add your frontend URLs
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow required methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Include required headers
}));
// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); // Allow the specific origin
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
        res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials
        return res.status(204).end(); // Respond with 204 (No Content)
    }
    next();
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
