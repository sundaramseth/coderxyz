import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './api/routes/users.route.js';
import authRoutes from './api/routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRoutes from './api/routes/post.route.js';
import commentRoutes from './api/routes/comment.route.js';
import path from 'path'; // You need to import path module

// For ES Modules: use fileURLToPath and dirname to get the __dirname equivalent
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
// app.use(cors({
//     origin: ['https://coderxyz.com', 'http://localhost:5173'], // Add your frontend URLs
//     credentials: true, // Allow credentials (cookies)
// }));

// Routes
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, 'dist')));
// Fallback route for React app (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
});



// Handle Preflight Requests
app.options('*', cors());
// Routes
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/comment', commentRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
