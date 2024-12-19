import React, { useState } from "react";
import { useAuth } from "../../AuthContext"; // Import authentication context to manage API key
import { login } from "../../api"; // Import the login API function
import { useNavigate } from "react-router-dom"; // Import for navigation after login
import "../../styles/Login.css"; // Import CSS styles for the login page

const Login = () => {
    // State hooks to manage form inputs and error messages
    const [username, setUsername] = useState(""); // State for username input
    const [password, setPassword] = useState(""); // State for password input
    const [error, setError] = useState(null); // State for login errors

    const { login: setApiKey } = useAuth(); // Extract the login function from AuthContext to store the API key
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        try {
            // Call the login API with username and password
            const { api } = await login(username, password);

            // If login is successful, save the API key to context and localStorage
            setApiKey(api); // Save API key to context
            localStorage.setItem("apiKey", api); // Save API key to localStorage for persistence

            // Clear any existing error messages
            setError(null);

            // Navigate to the movies page after successful login
            navigate("/movies");
        } catch (err) {
            // If an error occurs (e.g., invalid credentials), display an error message
            setError("Invalid username or password");
        }
    };

    return (
        // Render the login form
        <form onSubmit={handleSubmit}>
            <h1>Login</h1> {/* Page heading */}

            {/* Display error message if any */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Input field for username */}
            <input
                type="text"
                placeholder="Username" // Placeholder text for guidance
                value={username} // Bind input value to username state
                onChange={(e) => setUsername(e.target.value)} // Update username state on input change
            />

            {/* Input field for password */}
            <input
                type="password"
                placeholder="Password" // Placeholder text for guidance
                value={password} // Bind input value to password state
                onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            />

            {/* Submit button for the form */}
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
