import axios from "../../axios.js";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import { useEffect } from "react";

export default function Login() {
    const { isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContent)
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isLogin) {
                const { data } = await axios.post("api/auth/register",
                    { email, name, password },
                    { withCredentials: true });
                console.log(data.message);

                if (data.success) {
                    setIsLoggedIn(true)
                    setUserData(data.userData)
                    navigate('/')
                }
            }
            else {
                const { data } = await axios.post("api/auth/login",
                    { email, password },
                    { withCredentials: true }
                );
                console.log(data.message)
                if (data.success) {
                    setIsLoggedIn(true)
                    setUserData(data.userData)
                    navigate('/')
                }
            }
        } catch (err) {
            console.log(`Error While ${isLogin ? "Login" : "Signup"}`, err.message)
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-4">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>

                {!isLogin && (
                    <div className="mb-3">
                        <label className="block text-gray-600 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="block text-gray-600 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                    <p className="text-blue-900 cursor-pointer" onClick={()=>navigate('/reset-password')}>forgot Password?</p>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                <p className="text-sm text-center mt-4 text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </form>
        </div>
    );
}
