import axios from "../../axios.js";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";

export default function Login() {
    const { isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContent)
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setErrorMessage("");

        try {
            if (!isLogin) {
                const { data } = await axios.post("api/auth/register",
                    { email, name, password },
                    { withCredentials: true });

                if (data.success) {
                    setIsLoggedIn(true)
                    setUserData(data.userData)
                    navigate('/')
                } else if (data.errors) {
                    setErrors(data.errors)
                } else {
                    setErrorMessage(data.message || "Registration failed")
                }
            }
            else {
                const { data } = await axios.post("api/auth/login",
                    { email, password },
                    { withCredentials: true }
                );

                if (data.success) {
                    setIsLoggedIn(true)
                    setUserData(data.userData)
                    navigate('/')
                } else if (data.errors) {
                    setErrors(data.errors)
                } else {
                    setErrorMessage(data.message || "Login failed")
                }
            }
        } catch (err) {
            console.log(`Error While ${isLogin ? "Login" : "Signup"}`, err.message)
            setErrorMessage(`Error: ${err.response?.data?.message || err.message || "Something went wrong"}`)
        }
    };

    return (
        <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
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
                            value={name}
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
                        value={email}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {isLogin && (
                    <p className="text-blue-900 cursor-pointer mb-4" onClick={() => navigate('/reset-password')}>
                        Forgot Password?
                    </p>
                )}

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
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setErrors([])
                            setErrorMessage("")
                        }}
                        className="text-blue-600 hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </form>

            {errors.length > 0 && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 w-full max-w-sm">
                    <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                        {errors.map((x, index) => (
                            <li key={index}>{x.msg}</li>
                        ))}
                    </ul>
                </div>
            )}

            {errorMessage && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 w-full max-w-sm">
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                </div>
            )}
        </div>
    );
}