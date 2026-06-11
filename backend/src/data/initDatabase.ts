import createOrganizationTable from "./createOrganizationTable.ts";
import createProjectMemberTable from "./createProjectMemeberTable.ts";
import createProjectTable from "./createProjectTable.ts";
import createUserTable from "./createUserTable.ts";

export async function initDatabase() {
    await createOrganizationTable();
     await createUserTable();
     await createProjectTable();
     await createProjectMemberTable();
}