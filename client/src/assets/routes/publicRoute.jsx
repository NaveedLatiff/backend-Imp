import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "../../axios.js";

const PublicRoute = ({ children }) => {
  const { userData } = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.post("/api/auth/is-auth", {}, { withCredentials: true });
        if (data.success && data.user) {
          setIsVerified(data.user.isVerified);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return null; 

  if (isVerified) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
