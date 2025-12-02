import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import cron from 'node-cron'
import { limiter } from "./middleware/rateLimiter.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";

// Create __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir=path.join(__dirname,'data');
const backupDir=path.join(__dirname,'backups');


const app=express();
const PORT=process.env.PORT || 3003
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000",credentials:true}));

// Run after Every Minutes
// Day of week(0-6) Month(1-12) day of month(0-31) hour(0-23) minutes(0-59)
// Can give seconds also in the first * then ↑↑
cron.schedule('* * * * *',async()=>{
    try{

        const timestamp=new Date().toISOString().replace(/[:.]/g,'-')
        const destination=path.join(backupDir,`backup-${timestamp}`)

        await fs.cp(sourceDir,destination,{recursive:true},async(err)=>{
            if(err){
                console.log("Backup Failed ",err.message)
            }else{
                console.log("Backup created at ",destination)
            }
        })

    }catch(err){
        console.log("Backup Failed",err.message)
    }
})

app.use(limiter);

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})