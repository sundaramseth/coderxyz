import express from 'express'
import { test, unfollowChannel } from '../controllers/user.controller.js';
import {updateUser, getUsers, getUser, followChannel} from '../controllers/user.controller.js'
import {deleteUser, signout} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', getUsers);
router.get('/:userId', getUser);
router.post('/follow/:userId', verifyToken, followChannel);
router.delete('/unfollow/:userId', verifyToken, unfollowChannel);

export default router;