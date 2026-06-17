import pool from "../db/db.js";

export const assignMemberToProjectService = async (
    projectId: number,
    userId: number,
    organizationId: number
) => {

    // Step 1
    // Verify project belongs to organization

    const projectResult = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = $1
        AND organization_id = $2
        `,
        [
            projectId,
            organizationId
        ]
    );

    if (!projectResult.rows.length) {
        throw new Error(
            "Project not found"
        );
    }

    // Step 2
    // Verify user belongs to organization

    const memberResult = await pool.query(
        `
        SELECT *
        FROM organization_members
        WHERE user_id = $1
        AND organization_id = $2
        `,
        [
            userId,
            organizationId
        ]
    );

    if (!memberResult.rows.length) {
        throw new Error(
            "User does not belong to this organization"
        );
    }

    // Step 3
    // Prevent duplicate assignment

    const existingAssignment =
        await pool.query(
            `
            SELECT *
            FROM project_members
            WHERE project_id = $1
            AND user_id = $2
            `,
            [
                projectId,
                userId
            ]
        );

    if (existingAssignment.rows.length) {
        throw new Error(
            "User already assigned"
        );
    }

    // Step 4
    // Assign user

    const result = await pool.query(
        `
        INSERT INTO project_members (
            project_id,
            user_id
        )
        VALUES ($1, $2)
        RETURNING *
        `,
        [
            projectId,
            userId
        ]
    );

    return result.rows[0];
};


export const removeMemberFromProjectService = async (
    projectId: number,
    userId: number,
    organizationId: number
) => {

    const projectResult = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = $1
        AND organization_id = $2
        `,
        [
            projectId,
            organizationId
        ]
    );

    if (!projectResult.rows.length) {
        throw new Error(
            "Project not found"
        );
    }

    const result = await pool.query(
        `
        DELETE FROM project_members
        WHERE project_id = $1
        AND user_id = $2
        RETURNING *
        `,
        [
            projectId,
            userId
        ]
    );

    return result.rows[0];
};

export const getProjectWithMembersService =
async (projectId: number) => {

    const projectResult = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = $1
        `,
        [projectId]
    );

    const membersResult = await pool.query(
        `
        SELECT
            u.id,
            u.name,
            u.email
        FROM users u
        JOIN project_members pm
            ON u.id = pm.user_id
        WHERE pm.project_id = $1
        `,
        [projectId]
    );

    return {
        project: projectResult.rows[0],
        members: membersResult.rows
    };
};