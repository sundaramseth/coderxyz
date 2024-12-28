import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { create, getposts, deletepost, updatepost, likePost, savePost, getSavePost, unsavepost, getauthorposts  } from '../controllers/post.controler.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts);
router.get('/getauthorposts/:userId', getauthorposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);
router.put('/likepost/:postId', verifyToken, likePost);
router.post('/savepost/:postId/:userId', verifyToken, savePost);
router.get('/getsavedpost/:userId', getSavePost);
router.delete('/unsavepost/:postId/:userId', verifyToken, unsavepost);

export default router;