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
app.use('/api/user',userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);

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