import pool from "../db/db.js";

const createUserTable = async () => {
    const queryText = `
   CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
     token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
    `;
    try {
        await pool.query(queryText);
        console.log("User table created if not exits");

    } catch (error) {
        console.log("Error creating user table: ", error);


    }
}

export default createUserTable