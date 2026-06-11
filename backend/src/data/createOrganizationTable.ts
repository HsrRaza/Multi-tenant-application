import pool from "../db/db.ts";

const createOrganizationTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS organizations(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
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