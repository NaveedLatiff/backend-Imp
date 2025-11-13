import User from "../models/auth.js"

export const userData=async(req,res)=>{
    const userId=req.userId
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.json({
                success:false,
                message:`User Not Found ${user}`
            })
        }
        
        return res.json({
            success:true,
            userData:{
                name:user.name,
                isVerified:user.isVerified,
            }
        })

    }catch(err){
        return res.json({
            success:false,
            message:"Internal Server Error"
        })
    }
}