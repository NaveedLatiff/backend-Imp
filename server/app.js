import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import { limiter } from "./middleware/rateLimiter.js";

const app=express();
const PORT=process.env.PORT || 3003
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000",credentials:true}));

app.use(limiter);

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})