import axios from "../../axios.js";
import { useEffect } from "react";
import { useState } from "react"
import { createContext } from "react"

export const AppContent = createContext()
const AppContext = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                   const { data } = await axios.get("api/user/user-data"); 
                if (data.success) {
                    setIsLoggedIn(true);
                    setUserData(data.userData);
                } else {
                    setIsLoggedIn(false);
                    setUserData(null);
                }
            } catch (err) {
                setIsLoggedIn(false);
                setUserData(null);
            }
        };
        fetchUserData();
    }, []);

    const value = {
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
    };

    return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
}

export default AppContext
