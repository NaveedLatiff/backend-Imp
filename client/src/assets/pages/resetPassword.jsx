import { useState } from "react";
import axios from "../../axios.js";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate()

  // Step 1: Enter email
  const handleEmailSubmit = async (e) => {
    try{
        e.preventDefault();
        const {data}=await axios.post("/api/auth/reset-otp", { email });
        console.log(data.message)
        if(data.success){
            setStep(2);
        }
    }
    catch(err){
        console.log(err.message)
    }
  };

  // Step 2: Enter OTP
  const handleOtpSubmit = async (e) => {
    try{
        e.preventDefault();
        const {data}=await axios.post("/api/auth/verify-reset-otp", { email, otp });
        if(data.success){
            setStep(3);
        }
    }    catch(err){
        console.log(err.message)
    }

  };

  // Step 3: Enter new password
  const handlePasswordSubmit = async (e) => {
    try{

        e.preventDefault();
        const {data}=await axios.post("/api/auth/reset-password", { email, password });
        if(data.success){
            setStep(1);
            setEmail("");
            setOtp("");
            setPassword("");
            navigate("/login")
        }
    }
    catch(err){
        console.log(err.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Enter Your Email</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border rounded-md px-3 py-2 mb-4"
              required
            />
            <button
              type="submit"
              onClick={handleEmailSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Submit
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full border rounded-md px-3 py-2 mb-4"
              required
            />
            <button
              type="submit"
              onClick={handleOtpSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Submit
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Enter New Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full border rounded-md px-3 py-2 mb-4"
              required
            />
            <button
              type="submit"
              onClick={handlePasswordSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Reset Password
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
