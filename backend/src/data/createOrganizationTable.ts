import pool from "../db/db.js";

const createOrganizationTable = async () => {
    const queryText = `
  CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
`;

    try {
        await pool.query(queryText);
        console.log("organisation Table created if not exists");

    } catch (error) {
        console.error("Error creating organisation table:", error);
    }

}
export default createOrganizationTable;