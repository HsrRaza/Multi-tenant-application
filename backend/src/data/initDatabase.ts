import pool from "../db/db.ts";
import createOrgMemberTable from "./createOrganizationMemberTable.ts";
import createOrganizationTable from "./createOrganizationTable.ts";
import createProjectMemberTable from "./createProjectMemeberTable.ts";
import createProjectTable from "./createProjectTable.ts";
import createUserTable from "./createUserTable.ts";

export async function initDatabase() {
    
    
    await createUserTable();
    await createOrganizationTable();
    await createOrgMemberTable();
    await createProjectTable();
    await createProjectMemberTable();
}