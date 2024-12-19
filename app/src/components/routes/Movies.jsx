import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // For navigation between pages
import { getMovies, addToWatchlist } from "../../api"; // API functions
import { useAuth } from "../../AuthContext"; // Authentication context to retrieve API key
import NavBar from "../NavBar"; // Navbar component
import "../../styles/Movies.css"; // Styles specific to the Movies page

const Movies = () => {
    const { apiKey } = useAuth(); // Get API key from context
    const [movies, setMovies] = useState([]); // State to store all movies
    const [error, setError] = useState(null); // State to store error messages
    const [genre, setGenre] = useState(""); // State to track selected genre for filtering
    const [filteredMovies, setFilteredMovies] = useState([]); // State to store filtered movies
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query

    const [currentPage, setCurrentPage] = useState(1); // State for the current page in pagination
    const moviesPerPage = 10; // Number of movies to display per page

    const [message, setMessage] = useState(""); // State to display success messages

    // Calculate the range of movies to display on the current page
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const currentMovies = filteredMovies.slice(startIndex, endIndex);

    // Handle pagination when the user switches pages
    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(filteredMovies.length / moviesPerPage)) {
            setCurrentPage(page);
        }
    };

    // Fetch all movies when the component loads
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviesData = await getMovies(); // Fetch movies from the API
                setMovies(moviesData); // Update state with all movies
                setFilteredMovies(moviesData); // Initially show all movies
            } catch (err) {
                setError(err.message); // Handle API errors
            }
        };

        fetchMovies();
    }, []);

    // Filter movies by genre
    const handleGenreChange = (e) => {
        const selectedGenre = e.target.value; // Get selected genre
        setGenre(selectedGenre);

        if (selectedGenre === "") {
            setFilteredMovies(movies); // Show all movies if no genre is selected
        } else {
            setFilteredMovies(
                movies.filter((movie) => movie.genre.includes(selectedGenre)) // Filter by genre
            );
        }

        setCurrentPage(1); // Reset to the first page
    };

    // Filter movies by search query
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); // Convert query to lowercase
        setSearchQuery(query);
        setFilteredMovies(
            movies.filter((movie) =>
                movie.title.toLowerCase().includes(query) // Filter by movie title
            )
        );

        setCurrentPage(1); // Reset to the first page
    };

    // Handle quick addition of a movie to the watchlist
    const handleQuickAdd = async (movieId) => {
        try {
            await addToWatchlist(movieId, 1, apiKey); // Add movie to watchlist with default priority
            setMessage("Movie successfully added to your watchlist!"); // Show success message
            setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
        } catch (err) {
            setError("Failed to add the movie to your watchlist."); // Handle errors
        }
    };

    return (
        <div>
            <header><NavBar /></header> {/* Navbar for navigation */}
            <h1>Movies</h1>
            {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error messages */}
            {message && <p style={{ color: "green" }}>{message}</p>} {/* Display success messages */}

            {/* Search and filter section */}
            <div>
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={searchQuery}
                    onChange={handleSearch} // Update search query
                />
                <label htmlFor="genre-filter">Filter by Genre:</label>
                <select
                    id="genre-filter"
                    value={genre}
                    onChange={handleGenreChange} // Update genre filter
                >
                    <option value="">All</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Family">Family</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Science Fiction">Science Fiction</option>
                </select>
            </div>

            {/* Pagination controls */}
            <div>
                <button
                    onClick={() => handlePageChange(currentPage - 1)} // Go to the previous page
                    disabled={currentPage === 1} // Disable if on the first page
                >
                    Previous
                </button>
                <span>Page {currentPage} of {Math.ceil(filteredMovies.length / moviesPerPage)}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)} // Go to the next page
                    disabled={endIndex >= filteredMovies.length} // Disable if on the last page
                >
                    Next
                </button>
            </div>

            {/* Movie cards */}
            <div className="movies-grid">
                {currentMovies.map((movie) => (
                    <div key={movie.movie_id} className="movie-card">
                        <Link to={`/movies/${movie.movie_id}`}> {/* Link to movie details page */}
                            <img src={movie.cover} alt={movie.title} />
                            <h3>{movie.title}</h3>
                            <p>Rating: {movie.vote_average}</p>
                        </Link>
                        <button onClick={() => handleQuickAdd(movie.movie_id)}>
                            Quick Add to Watchlist
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination controls at the bottom */}
            <div>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {Math.ceil(filteredMovies.length / moviesPerPage)}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={endIndex >= filteredMovies.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Movies;
