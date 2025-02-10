import express from 'express'
import { getUserByName, test, unfollowChannel } from '../controllers/user.controller.js';
import {updateUser, getUsers, getUser, followChannel, profileView, updatePostImpressions} from '../controllers/user.controller.js'
import {deleteUser, signout} from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', getUsers);
router.get('/:userId', getUser);
router.get('/getuser/:userName', getUserByName);
router.post('/follow/:userId', verifyToken, followChannel);
router.delete('/unfollow/:userId', verifyToken, unfollowChannel);
router.put('/profile/view/:userId',verifyToken, profileView);
router.put("/update-impressions", updatePostImpressions);

export default router;