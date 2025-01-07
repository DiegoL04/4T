import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Cookies from "universal-cookie";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const logout = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <>
          <SignUp setIsAuthenticated={setIsAuthenticated}/>
          <Login setIsAuthenticated={setIsAuthenticated}/>
        </>
      ) : (
        <div>
          <h1>Welcome, {cookies.get("username")}!</h1>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
