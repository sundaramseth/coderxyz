import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './api/routes/users.route.js'
import authRoutes from './api/routes/auth.route.js'
import cookieParser from 'cookie-parser';
import postRoutes from './api/routes/post.route.js'
import commentRoutes from './api/routes/comment.route.js'

dotenv.config();

mongoose.connect(process.env.MANGO,{  
    useNewUrlParser: true,
    useUnifiedTopology: true,}).then(
    ()=>{
        console.log('MongoDb is connected')
    }).catch((err)=>{
        console.log(err)
        process.exit(1); // Crash gracefully if the connection fails
    });

const app = express();

const allowedOrigins = ['https://coderxyz.com', 'http://localhost:5173']; // Add frontend domains here

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.get('/',(req,res)=>{
    res.send('Hello World')
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
      }
      req.user = user;
      next();
    });
  };

app.use('/api/user',userRoutes,authenticateToken);
app.use('/api/auth', authRoutes);
app.use('/api/post',postRoutes,authenticateToken);
app.use('/api/comment',commentRoutes,authenticateToken);

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});

export default app;