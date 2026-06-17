import pool from "../db/db.js";

export const getDashboardService = async (
    organizationId: number
) => {

    const projectResult = await pool.query(
        `
        SELECT COUNT(*) as total_projects
        FROM projects
        WHERE organization_id = $1
        `,
        [organizationId]
    );

    const memberResult = await pool.query(
        `
        SELECT COUNT(*) as total_members
        FROM organization_members
        WHERE organization_id = $1
        `,
        [organizationId]
    );

   const assignedResult = await pool.query(
    `
    SELECT COUNT(*) as total_assignments
    FROM project_members pm
    JOIN projects p
        ON p.id = pm.project_id
    WHERE p.organization_id = $1
    `,
    [organizationId]
);

    return {
        totalProjects:
            Number(
                projectResult.rows[0]
                    .total_projects
            ),

        totalMembers:
            Number(
                memberResult.rows[0]
                    .total_members
            ),

        totalAssignments:
            Number(
                assignedResult.rows[0]
                    .total_assignments
            )
    };
};