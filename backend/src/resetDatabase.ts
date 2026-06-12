import pool from "./db/db.js";

 async function resetDB() {
    
    
    await pool.query(`
        DROP TABLE IF EXISTS project_members CASCADE;
        DROP TABLE IF EXISTS projects CASCADE;
        DROP TABLE IF EXISTS organization_members CASCADE;
        DROP TABLE IF EXISTS organizations CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        `);
}
resetDB()