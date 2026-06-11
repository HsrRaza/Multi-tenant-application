import pool from "../db/db.ts";

const createProjectTable = async ()=>{
    const queryText= `
    CREATE TABLE IF NOT EXISTS projects(
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100)  NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
    
    `;
    try {
        await pool.query(queryText);
        console.log("project table created successfully");
        
    } catch (error) {
        console.error("Error creating project table: ", error);
    }
}

export default createProjectTable;