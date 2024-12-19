import React, { useEffect, useState } from "react";
import {
    getCompletedWatchlist, // API function to fetch the completed watchlist
    updateCompletedWatchlistScore, // API function to update a movie's rating in the completed watchlist
    incrementTimesWatched, // API function to increment the times a movie has been watched
    removeFromCompletedWatchlist, // API function to remove a movie from the completed watchlist
} from "../../api";
import { useAuth } from "../../AuthContext"; // Context for managing authentication state
import NavBar from "../NavBar"; // Component for navigation bar
import "../../styles/CompletedWatchlist.css"; // CSS styles for this component

const CompletedWatchlist = () => {
    const { apiKey } = useAuth(); // Retrieve the API key from AuthContext
    const [completedMovies, setCompletedMovies] = useState([]); // State to store completed movies
    const [error, setError] = useState(null); // State to store error messages
    const [sortBy, setSortBy] = useState("rating"); // State to track the sorting criteria

    // Fetch completed watchlist when the component mounts
    useEffect(() => {
        const fetchCompletedMovies = async () => {
            try {
                const data = await getCompletedWatchlist(apiKey); // Fetch the completed watchlist from the API
                setCompletedMovies(data); // Store the fetched movies in state
            } catch (err) {
                setError(err.message); // Set an error message if the API call fails
            }
        };

        fetchCompletedMovies(); // Trigger the API call
    }, [apiKey]); // Run this effect when the API key changes

    // Sort movies by rating or date watched
    const handleSort = (criteria) => {
        setSortBy(criteria); // Update the sorting criteria
        const sortedMovies = [...completedMovies].sort((a, b) => {
            if (criteria === "rating") return b.rating - a.rating; // Sort by rating in descending order
            if (criteria === "date") return new Date(b.date_last_watched) - new Date(a.date_last_watched); // Sort by date in descending order
            return 0; // Default case (no sorting)
        });
        setCompletedMovies(sortedMovies); // Update the sorted movies in state
    };

    // Update a movie's rating
    const handleUpdateScore = async (entryId, newRating) => {
        try {
            await updateCompletedWatchlistScore(entryId, newRating, apiKey); // Update the rating in the API
            setCompletedMovies((prev) =>
                prev.map((movie) =>
                    movie.completed_id === entryId ? { ...movie, rating: newRating } : movie
                )
            ); // Update the movie's rating locally
        } catch (err) {
            setError(err.message); // Set an error message if the API call fails
        }
    };

    // Increment the number of times a movie has been watched
    const handleIncrementTimesWatched = async (entryId) => {
        try {
            await incrementTimesWatched(entryId, apiKey); // Increment times watched in the API
            setCompletedMovies((prev) =>
                prev.map((movie) =>
                    movie.completed_id === entryId
                        ? { ...movie, times_watched: movie.times_watched + 1 }
                        : movie
                )
            ); // Update the times watched locally
        } catch (err) {
            setError(err.message); // Set an error message if the API call fails
        }
    };

    // Remove a movie from the completed watchlist
    const handleRemove = async (entryId) => {
        try {
            await removeFromCompletedWatchlist(entryId, apiKey); // Remove the movie from the API
            setCompletedMovies((prev) => prev.filter((movie) => movie.completed_id !== entryId)); // Remove the movie locally
        } catch (err) {
            setError(err.message); // Set an error message if the API call fails
        }
    };

    return (
        <div>
            <header><NavBar /></header> {/* Render the navigation bar */}
            <h1>My Completed Movies</h1> {/* Page title */}
            {error && <p>{error}</p>} {/* Display error messages if any */}
            <div className="sort-buttons">
                {/* Buttons to sort movies */}
                <button onClick={() => handleSort("rating")}>Sort by Rating</button>
                <button onClick={() => handleSort("date")}>Sort by Date Watched</button>
            </div>
            {completedMovies.length === 0 ? (
                // Message when there are no movies in the completed watchlist
                <p>Your completed list is empty!</p>
            ) : (
                <div className="completed-grid">
                    {/* Display completed movies in a grid */}
                    {completedMovies.map((movie) => (
                        <div key={movie.movie_id} className="completed-card">
                            <img src={movie.cover} alt={movie.title} /> {/* Movie cover image */}
                            <h3>{movie.title}</h3> {/* Movie title */}
                            <p>Rating: {movie.rating}</p> {/* Movie rating */}
                            <p>Times Watched: {movie.times_watched}</p> {/* Times watched */}
                            <p>Date Watched: {new Date(movie.date_last_watched).toLocaleDateString()}</p> {/* Date last watched */}
                            {movie.notes && <p>Notes: {movie.notes}</p>} {/* Display notes if available */}
                            <div className="actions">
                                {/* Buttons for actions */}
                                <button
                                    onClick={() => handleUpdateScore(movie.completed_id, movie.rating + 1)}
                                >
                                    Increase Rating
                                </button>
                                <button
                                    onClick={() =>
                                        handleUpdateScore(movie.completed_id, Math.max(movie.rating - 1, 0))
                                    }
                                >
                                    Decrease Score
                                </button>
                                <button
                                    onClick={() => handleIncrementTimesWatched(movie.completed_id)}
                                >
                                    Watched Again
                                </button>
                                <button onClick={() => handleRemove(movie.completed_id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedWatchlist;
