import React, { createContext, useState, useContext } from "react";

// Create the AuthContext to manage authentication state globally
const AuthContext = createContext();

// Provide the authentication state and functions to the entire app
export const AuthProvider = ({ children }) => {
    // State to store the user's API key (or authentication token)
    const [apiKey, setApiKey] = useState(null);

    // Function to set the API key when the user logs in
    const login = (key) => setApiKey(key);

    // Function to clear the API key when the user logs out
    const logout = () => setApiKey(null);

    return (
        // Provide the API key and authentication functions to all child components
        <AuthContext.Provider value={{ apiKey, login, logout }}>
            {children} {/* Render child components inside the provider */}
        </AuthContext.Provider>
    );
};

// Custom hook to access authentication state and functions
export const useAuth = () => useContext(AuthContext);
