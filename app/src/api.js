// Base URL for the API
const API_BASE_URL = "https://loki.trentu.ca/~hhussainzada/3430/assn/Assignment2/assn2-Hikmatullah6/api";

// Fetch all movies from the API
export const getMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/movies`);
    if (!response.ok) throw new Error("Failed to fetch movies"); // Handle error
    return await response.json(); // Return movies data as JSON
};

// Fetch details for a specific movie by ID
export const getMovieDetails = async (id) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    if (!response.ok) throw new Error("Failed to fetch movie details"); // Handle error
    return await response.json(); // Return movie details
};

// Login user by sending username and password to the API
export const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/users/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set content type
        body: JSON.stringify({ username, password }), // Send credentials
    });
    if (!response.ok) throw new Error("Login failed"); // Handle error
    return await response.json(); // Return API key
};

// Add a movie to the watchlist with optional notes
export const addToWatchlist = async (movieId, priority, apiKey, notes) => {
    const response = await fetch(`${API_BASE_URL}/towatchlist/entries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set content type
            "X-API-KEY": apiKey, // Pass API key for authentication
        },
        body: JSON.stringify({ movie_id: movieId, priority, notes }), // Include notes and priority
    });
    if (!response.ok) throw new Error("Failed to add to watchlist"); // Handle error
    return await response.json(); // Return response
};

// Update notes for a specific watchlist entry
export const updateWatchlistNotes = async (entryId, notes, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/towatchlist/entries/${entryId}/notes`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json", // Set content type
            "X-API-KEY": apiKey, // Pass API key for authentication
        },
        body: JSON.stringify({ notes }), // Include updated notes
    });
    if (!response.ok) throw new Error("Failed to update notes"); // Handle error
    return await response.json(); // Return response
};

// Add a movie to the completed watchlist with optional notes
export const addToCompletedWatchlist = async (movieId, rating, apiKey, notes) => {
    const response = await fetch(`${API_BASE_URL}/completedwatchlist/entries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set content type
            "X-API-KEY": apiKey, // Pass API key for authentication
        },
        body: JSON.stringify({ movie_id: movieId, rating, notes }), // Include rating and notes
    });
    if (!response.ok) throw new Error("Failed to add to completed watchlist"); // Handle error
    return await response.json(); // Return response
};

// Fetch the user's watchlist
export const getWatchlist = async (apiKey) => {
    const response = await fetch(`${API_BASE_URL}/towatchlist/entries`, {
        headers: { "X-API-KEY": apiKey }, // Pass API key for authentication
    });
    if (!response.ok) throw new Error("Failed to fetch watchlist"); // Handle error
    return await response.json(); // Return watchlist data
};

// Update the priority of a specific watchlist entry
export const updateWatchlistPriority = async (entryId, newPriority, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/towatchlist/entries/${entryId}/priority`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json", // Set content type
            "X-API-KEY": apiKey, // Pass API key for authentication
        },
        body: JSON.stringify({ priority: newPriority }), // Include updated priority
    });
    if (!response.ok) throw new Error("Failed to update priority"); // Handle error
    return await response.json(); // Return response
};

// Remove an entry from the watchlist
export const removeFromWatchlist = async (entryId, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/towatchlist/entries/${entryId}`, {
        method: "DELETE",
        headers: { "X-API-KEY": apiKey }, // Pass API key for authentication
    });
    if (!response.ok) throw new Error("Failed to remove entry from watchlist"); // Handle error
    return await response.json(); // Return response
};

// Mark a movie as watched by adding it to the completed watchlist
export const markAsWatched = async (movieId, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/completedwatchlist/entries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Set content type
            "X-API-KEY": apiKey, // Pass API key for authentication
        },
        body: JSON.stringify({ movie_id: movieId, rating: 5 }), // Default rating: 5
    });
    if (!response.ok) throw new Error("Failed to mark as watched"); // Handle error
    return await response.json(); // Return response
};

// Fetch the user's completed watchlist
export const getCompletedWatchlist = async (apiKey) => {
    const response = await fetch(`${API_BASE_URL}/completedwatchlist/entries`, {
        headers: { "X-API-KEY": apiKey }, // Pass API key for authentication
    });
    if (!response.ok) throw new Error("Failed to fetch completed watchlist"); // Handle error
    return await response.json(); // Return completed watchlist data
};

// Update the score (rating) of a movie in the completed watchlist
export const updateCompletedWatchlistScore = async (entryId, rating, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/completedwatchlist/entries/${entryId}/rating`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json", // Set content type
            "X-API-KEY": apiKey, // Pass API key for authentication
        },
        body: JSON.stringify({ rating }), // Include updated rating
    });
    if (!response.ok) throw new Error("Failed to update score"); // Handle error
};

// Increment the times watched count for a movie in the completed watchlist
export const incrementTimesWatched = async (entryId, apiKey) => {
    const response = await fetch(
        `${API_BASE_URL}/completedwatchlist/entries/${entryId}/times-watched`,
        {
            method: "PATCH",
            headers: { "X-API-KEY": apiKey }, // Pass API key for authentication
        }
    );
    if (!response.ok) throw new Error("Failed to increment times watched"); // Handle error
};

// Remove an entry from the completed watchlist
export const removeFromCompletedWatchlist = async (entryId, apiKey) => {
    const response = await fetch(`${API_BASE_URL}/completedwatchlist/entries/${entryId}`, {
        method: "DELETE",
        headers: { "X-API-KEY": apiKey }, // Pass API key for authentication
    });
    if (!response.ok) throw new Error("Failed to remove movie from completed list"); // Handle error
};
