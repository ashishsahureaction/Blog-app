import express from 'express';
import { test, updateUser, signout, deleteUser, getUsers, getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();


router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/getusers',  getUser);


export default router;


//ex-we verify the token if the token is verified then user is going added to the request as per verfify fn in verifyUser.jsx and
// then go to the next fn which update user