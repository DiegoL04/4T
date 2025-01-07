import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import db from "./db.js";
const app = express();
const JWT_SECRET = "z8dDslFl6DfbrkrQN8r93nqa619E6f3o";

app.use(cors());
app.use(express.json());

// Sign up backend handling
app.post("/signUp", async (req, res) => {
  try {

    // Take in passed username and password info from "function" call
    const {username, password } = req.body;

    // Error if either username or password is blank
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check to make sure the user doesn't already exist
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the passed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique user ID
    const userId = uuidv4();

    // Add the user into the database
    await db.query(
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
      [userId, username, hashedPassword]
    );

    // Generate a token with id and username info
    const token = jwt.sign({ userId: userId, username: username }, JWT_SECRET, {expiresIn: "1h",});
    
    res.status(201).json({ message: "User registered successfully", userId, token, username });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login backend handling
app.post("/login", async (req, res) => {
  try {
    // Take in passed username and password info from "function" call
    const { inputUsername, password } = req.body;
    // Error if either username or password is blank
    if (!inputUsername || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Query users from database that match the username
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [inputUsername]);
    // If rows is empty, the user does not exist
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Fill user variable with the tuple information
    const user = rows[0];

    // Password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials"});
    }

    // Generate a token with userId and username
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {expiresIn: "1h",});

    // Return token, userId, and username
    res.status(200).json({
    message: "Login successful",
    token,
    userId: user.id,
    username: user.username,});
    console.log(user.username, " logged in!")

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/start", async (req, res) => {
  try{
    const {oppName, username} = req.body;
    console.log(username, "challenged ", oppName);

    if (!oppName) {
      return res.status(400).json({ message: "Username is required" });
    }
    // Query users from database that match the username
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [oppName]);
    // If rows is empty, the user does not exist
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const roomId = uuidv4();
    
    await db.query(
      "INSERT INTO rooms (roomId, p1, p2) VALUES (?, ?, ?)",
      [roomId, username, oppName]
    );
    res.status(200).json({
      message: "Room created",
      roomId,
      username,
      oppName,});

    console.log(`Room created: ${roomId}, Players: ${[username, oppName]}`);


  } catch (error) {
    console.error("Error during challenge:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
