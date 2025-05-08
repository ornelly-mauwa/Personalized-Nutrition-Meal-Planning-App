import dotenv from 'dotenv';
import Express from "express";
import bcrypt from "bcrypt";
import cookiesPaser from "cookie-parser";
import Cors from "cors";
import pool from './database.js';
import jwt from "jsonwebtoken";

const app = Express();
const db = pool;
dotenv.config();

app.use(Cors({
    origin: ['http://localhost:8081', 'http://192.168.10.160:8081'],// Your Expo app URL
    credentials: true
}));

app.set("mymeal", "app");
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static("public"));
app.use(cookiesPaser());

app.use(function (req, res, next) {
    res.locals.errors = [];
    try {
        const token = req.cookies.ourSimpleApp || req.headers['authorization']?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWTSECRET);
            req.user = decoded;
        } else {
            req.user = false;
        }
    } catch (err) {
        req.user = false;
    }

    res.locals.user = req.user;
    next();
});

// Get user profile endpoint
app.get("/api/users/me", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({
        id: req.user.userid,
        username: req.user.username,
        role: req.user.role
    });
});

// Login endpoint
app.post("/api/users/login", async (req, res) => {
    const errors = [];

    if (!req.body.email) errors.push("You must provide an email");
    if (!req.body.password) errors.push("You must provide a password");

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    try {
        // Look up the user by email
        const [results] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [req.body.email]
        );

        const user = results[0];

        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                userid: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user' // Default to 'user' if no role is set
            },
            process.env.JWTSECRET
        );

        // Set cookie for web clients
        res.cookie("ourSimpleApp", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24
        });

        // Return user data and token for mobile clients
        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Registration endpoint
app.post("/api/users/register", async (req, res) => {
    const errors = [];

    // Validate inputs
    if (!req.body.username) errors.push("You must provide a username");
    if (!req.body.email) errors.push("You must provide an email");
    if (!req.body.password) errors.push("You must provide a password");

    if (req.body.username && req.body.username.length < 3) errors.push("Username must be at least 3 characters");
    if (req.body.password && req.body.password.length < 5) errors.push("Password must be at least 5 characters");

    // Validate role (if provided)
    const validRoles = ['user', 'admin', 'nutritionist'];
    const role = req.body.role || 'user'; // Default to 'user'

    if (!validRoles.includes(role)) {
        errors.push("Invalid role specified");
    }

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    try {
        // Check if email already exists
        const [emailCheck] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [req.body.email]
        );

        if (emailCheck.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        // Insert the user with role
        const [result] = await db.query(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [req.body.username, req.body.email, hashedPassword, role]
        );

        // Get the inserted ID
        const insertId = result.insertId;

        // Look up the newly created user
        const [lookupResults] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [insertId]
        );

        const newUser = lookupResults[0];

        if (!newUser) {
            throw new Error("User not found after creation");
        }

        // Create JWT token
        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                userid: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            process.env.JWTSECRET
        );

        // Set cookie for web clients
        res.cookie("ourSimpleApp", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24
        });

        // Return user data and token for mobile clients
        return res.json({
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Get user roles endpoint
app.get("/api/users/roles", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({
        role: req.user.role
    });
});

// Logout endpoint
app.post("/api/users/logout", (req, res) => {
    res.clearCookie("ourSimpleApp");
    return res.json({ message: "Logged out successfully" });
});

// PORT
const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));