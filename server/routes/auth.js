import express from 'express';
const authRouter=express.Router()

import  {register} from '../controllers/auth.js'
import  {login} from '../controllers/auth.js'
import  {logout} from '../controllers/auth.js'
import  {sendVerifyOtp} from '../controllers/auth.js'
import  {verifyEmail} from '../controllers/auth.js'
import  {isAuthenticated} from '../controllers/auth.js'
import  {sendResetOtp} from '../controllers/auth.js'
import  {resetPassword} from '../controllers/auth.js'
import  {verifyResetOtp} from '../controllers/auth.js'


import userAuth from '../middleware/userAuth.js';
import { validationLogin, validationRegistration } from '../middleware/formValidation.js';


authRouter.post('/register',validationRegistration,register);
authRouter.post('/login',validationLogin,login);
authRouter.post('/logout',logout);
authRouter.post('/send-verification-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-email',userAuth,verifyEmail);
authRouter.post('/is-auth',userAuth,isAuthenticated);
authRouter.post('/reset-otp',sendResetOtp);
authRouter.post('/verify-reset-otp',verifyResetOtp);
authRouter.post('/reset-password',resetPassword);

export default authRouter;