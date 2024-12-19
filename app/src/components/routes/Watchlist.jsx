import React, { useEffect, useState } from "react";
import { getWatchlist, updateWatchlistPriority, removeFromWatchlist, markAsWatched } from "../../api";
// Import API functions for fetching and updating the watchlist
import { useAuth } from "../../AuthContext"; // Import authentication context
import NavBar from "../NavBar"; // Import navigation bar component
import "../../styles/Watchlist.css"; // Import CSS styles for the Watchlist component

const Watchlist = () => {
    const { apiKey } = useAuth(); // Access API key from AuthContext
    const [watchlist, setWatchlist] = useState([]); // State to store the watchlist
    const [error, setError] = useState(null); // State to store any error messages

    // Fetch watchlist data when the component loads or when the API key changes
    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const data = await getWatchlist(apiKey); // Fetch watchlist data
                setWatchlist(sortByPriority(data)); // Sort movies by priority before setting state
            } catch (err) {
                setError(err.message); // Set error message if the API call fails
            }
        };

        fetchWatchlist();
    }, [apiKey]);

    // Helper function to sort movies by priority in descending order
    const sortByPriority = (movies) => {
        return movies.slice().sort((a, b) => b.priority - a.priority); // Higher priority comes first
    };

    // Update the priority of a movie in the watchlist
    const handleUpdatePriority = async (entryId, newPriority) => {
        try {
            await updateWatchlistPriority(entryId, newPriority, apiKey); // Call API to update priority
            setWatchlist((prev) =>
                sortByPriority(
                    prev.map((movie) =>
                        movie.towatch_id === entryId ? { ...movie, priority: newPriority } : movie
                    )
                )
            ); // Update state with the new priority and re-sort
        } catch (err) {
            setError(err.message); // Set error message if the API call fails
        }
    };

    // Remove a movie from the watchlist
    const handleRemove = async (entryId) => {
        try {
            await removeFromWatchlist(entryId, apiKey); // Call API to remove the movie
            setWatchlist((prev) =>
                sortByPriority(prev.filter((movie) => movie.towatch_id !== entryId))
            ); // Remove the movie from state and re-sort
        } catch (err) {
            setError(err.message); // Set error message if the API call fails
        }
    };

    // Mark a movie as watched and remove it from the watchlist
    const handleMarkAsWatched = async (movieId, entryId) => {
        try {
            await markAsWatched(movieId, apiKey); // Add the movie to the completed list
            handleRemove(entryId); // Remove the movie from the watchlist
            setWatchlist((prev) =>
                sortByPriority(prev.filter((movie) => movie.towatch_id !== entryId))
            ); // Update state and re-sort
        } catch (err) {
            setError(err.message); // Set error message if the API call fails
        }
    };

    return (
        <div>
            <header><NavBar /></header> {/* Render the navigation bar */}
            <h1>My Watchlist</h1>
            {error && <p>{error}</p>} {/* Display any error messages */}
            {watchlist.length === 0 ? (
                <p>Your watchlist is empty!</p>
            ) : (
                <div className="watchlist-grid">
                    {/* Render a card for each movie in the watchlist */}
                    {watchlist.map((movie) => (
                        <div key={movie.movie_id} className="watchlist-card">
                            <img src={movie.cover} alt={movie.title} /> {/* Movie cover */}
                            <h3>{movie.title}</h3> {/* Movie title */}
                            <p>Priority: {movie.priority}</p> {/* Movie priority */}
                            {movie.notes && <p>Notes: {movie.notes}</p>} {/* Optional notes */}
                            <div className="actions">
                                {/* Buttons for managing the movie in the watchlist */}
                                <button onClick={() => handleUpdatePriority(movie.towatch_id, movie.priority + 1)}>
                                    Increase Priority
                                </button>
                                <button onClick={() => handleUpdatePriority(movie.towatch_id, movie.priority - 1)}>
                                    Decrease Priority
                                </button>
                                <button onClick={() => handleMarkAsWatched(movie.movie_id, movie.towatch_id)}>
                                    Mark as Watched
                                </button>
                                <button onClick={() => handleRemove(movie.towatch_id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
