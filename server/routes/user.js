import express from 'express'
const userRouter=express.Router()

import {userData} from '../controllers/user.js'

import userAuth from '../middleware/userAuth.js';

userRouter.get('/user-data',userAuth,userData);

export default userRouter;