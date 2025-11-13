import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios.js";
import { AppContent } from "../context/AppContext.jsx";

const VerifyEmail = () => {
  const {setUserData}=useContext(AppContent)
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/verify-email", { otp });
      console.log(data.message)
      if (data.success) {
        navigate('/')
        setUserData(data.userData)
      }
    } catch (err) {
      console.log("Error while verfiying email",err.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter OTP"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        onClick={handleVerify}
        >
          Submit
        </button>

      </form>
    </div>
  );
};

export default VerifyEmail;
