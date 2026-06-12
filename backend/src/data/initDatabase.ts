import pool from "../db/db.js";
import createOrgMemberTable from "./createOrganizationMemberTable.js";
import createOrganizationTable from "./createOrganizationTable.js";
import createProjectMemberTable from "./createProjectMemeberTable.js";
import createProjectTable from "./createProjectTable.js";
import createUserTable from "./createUserTable.js";

export async function initDatabase() {
    
    
    await createUserTable();
    await createOrganizationTable();
    await createOrgMemberTable();
    await createProjectTable();
    await createProjectMemberTable();
}