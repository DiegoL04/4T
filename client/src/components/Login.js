import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function Login( { setIsAuthenticated }) {
  // Manage both username and password in a single state object.
  const [credentials, setCredentials] = useState({ inputUsername: "", password: "" });

  const cookies = new Cookies();

  // Update the credentials state when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login logic
  const login = async () => {
    try {
      const { inputUsername, password } = credentials;
      // Send request to backend
      console.log("Making login request");
      const res = await Axios.post("http://localhost:3002/login", { inputUsername, password });
      // Extract token and userId from the response
      const { token, userId, username } = res.data;

      // Set the cookies
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login">
      <label> Login</label>

      {/* Use name attributes for easier state handling */}
      <input
        name="inputUsername"
        placeholder="Username"
        value={credentials.inputUsername}
        onChange={handleChange}
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
      />
      <button onClick={login}> Login</button>
    </div>
  );
}

export default Login;

