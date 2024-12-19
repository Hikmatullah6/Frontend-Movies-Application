import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Importing required components and hooks for routing
import Login from "./Login"; // Login page component
import Movies from "./Movies"; // Movies page component
import MovieDetails from "./MovieDetails"; // Movie details page component
import Watchlist from "./Watchlist"; // Watchlist page component
import CompletedWatchlist from "./CompletedWatchlist"; // Completed watchlist page component
import { useAuth } from "../../AuthContext"; // Hook to access authentication context

const AppRoutes = () => {
    const { apiKey } = useAuth(); // Access the API key from the AuthContext to check authentication

    return (
        <Router> {/* Provides routing functionality */}
            <Routes>
                {/* Public route for login */}
                <Route path="/login" element={<Login />} />

                {/* Protected routes: Only accessible if apiKey exists */}
                {apiKey ? (
                    <>
                        {/* Route for movies page */}
                        <Route path="/movies" element={<Movies />} />

                        {/* Route for movie details page with a dynamic `id` parameter */}
                        <Route path="/movies/:id" element={<MovieDetails />} />

                        {/* Route for watchlist page */}
                        <Route path="/watchlist" element={<Watchlist />} />

                        {/* Route for completed watchlist page */}
                        <Route path="/completed" element={<CompletedWatchlist />} />

                        {/* Default route redirects to movies if logged in */}
                        <Route path="/" element={<Navigate to="/movies" />} />
                    </>
                ) : (
                    // Redirect unauthenticated users to the login page
                    <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </Router>
    );
};

export default AppRoutes;

