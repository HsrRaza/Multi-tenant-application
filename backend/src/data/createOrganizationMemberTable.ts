import pool from "../db/db.js";

const createOrgMemberTable = async () => {
    const queryText = `
  
CREATE TABLE IF NOT EXISTS organization_members (
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20)
        CHECK(role IN ('admin','member')),
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (organization_id, user_id)
);
    `;
    try {
        await pool.query(queryText);
        console.log("project member table created successfully");
    } catch (error) {
        console.error("Error creating project member table: ", error);
    }
}

export default createOrgMemberTable