import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp({setIsAuthenticated}) {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);

  const signUp = () => {
    Axios.post("http://localhost:3002/signUp", user).then((res) => {
      const { token, userId, username } =
        res.data;
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      setIsAuthenticated(true)
      });
  };
  return (
    <div className="signUp">
      <label> Sign Up</label>
      <input
        placeholder="Username"
        onChange={(event) => {
          setUser({ ...user, username: event.target.value });
        }}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(event) => {
          setUser({ ...user, password: event.target.value });
        }}
      />
      <button onClick={signUp}> Sign Up</button>
    </div>
  );
}

export default SignUp;
