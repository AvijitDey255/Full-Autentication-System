import express, { Router } from "express"
import { emailVerify, forgotPassword, getAllUsers, loginUser, logoutUser, profileUser, regesterUser, resetPassword } from "../controllers/user.controllers.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
const userRouter = Router()
userRouter.get('/',getAllUsers)
userRouter.post('/register',regesterUser)
userRouter.post('/login',loginUser)
userRouter.post('/email-verify',emailVerify)
userRouter.post('/logout',logoutUser)
userRouter.get('/profile',authMiddleware,profileUser)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password/:token',resetPassword)


export default userRouter