import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import to retrieve URL parameters
import {
    getMovieDetails, // API function to fetch movie details
    addToWatchlist, // API function to add a movie to the watchlist
    addToCompletedWatchlist, // API function to add a movie to the completed list
} from "../../api";
import { useAuth } from "../../AuthContext"; // Import authentication context for API key
import NavBar from "../NavBar"; // Navbar component
import "../../styles/MovieDetails.css"; // Import styles for this component

const MovieDetails = () => {
    const { id } = useParams(); // Retrieve the `id` parameter from the URL
    const { apiKey } = useAuth(); // Retrieve the API key from the authentication context
    const [movie, setMovie] = useState(null); // State to store movie details
    const [error, setError] = useState(null); // State to store error messages
    const [message, setMessage] = useState(""); // State to store success messages
    const [notes, setNotes] = useState(""); // State to hold optional notes input

    // Fetch movie details when the component is mounted
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const movieData = await getMovieDetails(id); // Call API to fetch movie details
                setMovie(movieData); // Update the movie state with fetched data
            } catch (err) {
                setError(err.message); // Handle and display error if API call fails
            }
        };

        fetchMovieDetails();
    }, [id]); // Dependency array ensures the effect runs when `id` changes

    // Function to handle adding the movie to the watchlist
    const handleAddToWatchlist = async () => {
        try {
            await addToWatchlist(id, 1, apiKey, notes); // Add movie to the watchlist with default priority and notes
            setMessage("Movie added to your watchlist!"); // Display success message
            setNotes(""); // Clear notes input
        } catch (err) {
            setError(err.message); // Display error message if API call fails
        }
    };

    // Function to handle adding the movie to the completed watchlist
    const handleAddToCompletedWatchlist = async () => {
        try {
            await addToCompletedWatchlist(id, 5, apiKey, notes); // Add movie to completed list with default rating and notes
            setMessage("Movie added to your completed watchlist!"); // Display success message
            setNotes(""); // Clear notes input
        } catch (err) {
            setError(err.message); // Display error message if API call fails
        }
    };

    // Show an error message if something goes wrong
    if (error) return <p>{error}</p>;
    // Show a loading message while fetching movie details
    if (!movie) return <p>Loading...</p>;

    return (
        <div className="movie-details">
            <header><NavBar /></header> {/* Navbar for navigation */}
            <h1>{movie.title}</h1> {/* Movie title */}
            <img src={movie.cover} alt={movie.title} /> {/* Movie cover image */}
            <p>Runtime: {movie.runtime} minutes</p> {/* Movie runtime */}
            <h3>Overview</h3>
            <p>{movie.overview}</p> {/* Movie overview/description */}
            <p>Release Date: {movie.release_date}</p> {/* Movie release date */}
            <p>Rating: {movie.vote_average}</p> {/* Movie average rating */}

            {/* Display success or error messages */}
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Notes input field for user */}
            <div>
                <textarea
                    placeholder="Add optional notes about this movie..." // Placeholder text
                    value={notes} // Bind notes state to textarea value
                    onChange={(e) => setNotes(e.target.value)} // Update notes state on input change
                    rows={4} // Set height of textarea
                    style={{ width: "100%", marginBottom: "10px" }} // Inline styling for textarea
                />
            </div>

            {/* Buttons for adding to watchlist or completed list */}
            <div>
                <button onClick={handleAddToWatchlist}>Add to Watchlist</button> {/* Add to watchlist button */}
                <button onClick={handleAddToCompletedWatchlist}>Add to Completed Watchlist</button> {/* Add to completed list button */}
            </div>
        </div>
    );
};

export default MovieDetails;

