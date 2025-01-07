import React, { useState } from "react";
import Cookies from "universal-cookie";
import Axios from "axios";

function JoinGame({setInGame}){
    const cookies = new Cookies();
    const [oppName, setOppName] = useState("")
    const username = cookies.get("username")

    const start = async () => {
        try {
            const res = await Axios.post("http://localhost:3002/start", {oppName, username});

            if (res.status === 200) {
                const {roomId} = res.data;
                window.location.href = `/room/${roomId}`;
                setInGame(true)
                cookies.set("roomId", roomId)
                cookies.set("p2", oppName)
            }

        } catch (error) {
          console.error("Challenge failed:", error);
        }
    };

    return (
        <div className = "joinGame">
            <h4>Start Game</h4>
            <input placeholder="Enter username" onChange={(event) => {setOppName(event.target.value);}}/>
            <button onClick={start}>Start Game</button>
        </div>
    )
}
export default JoinGame;