import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const expiryTime = decoded.exp * 1000;  
                // console.log("Decoded Token:", decoded);


                // Check if the token is expired
                if (expiryTime < Date.now()) {
                    localStorage.removeItem("token"); // Remove expired token
                    setAuth(null); // Clear the auth state
                } else {
                    setAuth({ token, user: decoded });
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
                setAuth(null);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
