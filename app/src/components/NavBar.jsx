import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink for navigation links and useNavigate for programmatic navigation
import { useAuth } from "../AuthContext"; // Import authentication context
import "../styles/NavBar.css"; // Import styles for the navigation bar

const NavBar = () => {
    const { apiKey, logout } = useAuth(); // Destructure API key and logout function from AuthContext
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Function to handle user logout
    const handleLogout = () => {
        logout(); // Clear the API key from context (logs out the user)
        navigate("/login"); // Redirect the user to the login page
    };

    return (
        <nav className="navbar">
            {/* Display navigation links only if the user is logged in (API key exists) */}
            {apiKey && (
                <>
                    <NavLink to="/movies">Movies</NavLink> {/* Link to the Movies page */}
                    <NavLink to="/watchlist">Watchlist</NavLink> {/* Link to the Watchlist page */}
                    <NavLink to="/completed">Completed Watchlist</NavLink> {/* Link to the Completed Watchlist page */}
                </>
            )}
            {/* Display the logout button only if the user is logged in */}
            {apiKey && (
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            )}
        </nav>
    );
};

export default NavBar;

