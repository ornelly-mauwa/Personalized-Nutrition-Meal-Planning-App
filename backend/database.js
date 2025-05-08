import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: 'M@uwa123!@#',  // Your MySQL password
    database: 'mymeal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create a function to initialize the database (create tables if they don't exist)
export const initDb = async () => {
    try {
        // Create users table with role column
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin', 'nutritionist') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

// Initialize the database when the server starts
initDb().catch(console.error);

export default pool;