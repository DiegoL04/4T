import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import JoinGame from "./components/JoinGame";
import Cookies from "universal-cookie";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [inGame, setInGame] = useState(!!token);

  const logout = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    setIsAuthenticated(false);
    setInGame(false);
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
          {inGame ? 
          (
            <div>
              <h1>In game: {cookies.get("roomId")}</h1>
              <h2>Against: {cookies.get("p2")}</h2>
              <button onClick={logout}>Logout</button>
            </div>
          ) 
          : 
          (
            <div>
              <h1>Welcome, {cookies.get("username")}!</h1>
              <JoinGame setInGame={setInGame}/>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
