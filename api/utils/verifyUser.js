import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


export const verifyToken = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token
    // const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401,'Unauthorized'));

    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return next(errorHandler(401, 'Unauthorized'))
        }
        req.user = user;
        next();
    })
}


// , (req, res) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Extract the token
  
//     if (!token) {
//       return res.status(401).json({ error: 'Authorization token missing' });
//     }
  
//     // Verify the token (example using jwt)
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//       if (err) return res.status(403).json({ error: 'Invalid token' });
//       req.user = user; // Save user details for further processing
//       res.status(200).json({ message: 'Post saved successfully' });
//     });
//   });