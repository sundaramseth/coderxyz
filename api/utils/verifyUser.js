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
