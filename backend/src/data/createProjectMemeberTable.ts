import pool from "../db/db.js";

const createProjectMemberTable = async ()=>{
    const queryText= `
   CREATE TABLE IF NOT EXISTS project_members (
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);
    `;
    try {
        await pool.query(queryText);
        console.log("project member table created successfully");
    } catch (error) {
        console.error("Error creating project member table: ", error);
    }
}

export default createProjectMemberTable