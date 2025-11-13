import { useContext } from 'react'
import { AppContent } from '../context/AppContext'
import axios from '../../axios.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { isLoggedIn,setIsLoggedIn,userData} = useContext(AppContent)
    const navigate = useNavigate()
    const logout = async () => {
        const { data } = await axios.post("api/auth/logout")
        console.log(data.message)
        if (data.success) {
            setIsLoggedIn(false)
            alert("you Logged Out")
        }
    }
    
    const sendVerfiyOtp=async()=>{
        try{
            const {data}=await axios.post("api/auth/send-verification-otp")
            console.log(data.message)
            if(data.success){
                navigate('/verify-email')
            }
        }
        catch(err){
        console.log("Error while sending verification otp",err.message)
        }
    }

    return (

        <>
            <div className='flex gap-3 justify-end mr-2.5 mt-2.5 '>
                <button
                    onClick={isLoggedIn ? logout : () => navigate('/login')}
                    className='border-2 border-gray-500 rounded-3xl px-2 py-1 hover:cursor-pointer hover:bg-gray-100'>
                    {isLoggedIn ? "Logout" : "Login"}
                </button>
                  {!userData?.isVerified?<button
                    onClick={sendVerfiyOtp}
                    className='border-2 border-gray-500 rounded-3xl px-2 py-1 hover:cursor-pointer hover:bg-gray-100'>
                    Verify
                
                </button>:""}
            </div>
            <div className='h-[80vh]  flex justify-center items-center'>
                Welcome To AMJOTECH,{isLoggedIn ?  userData.name :"Developer" }
            </div>
        </>
    )
}

export default Home
