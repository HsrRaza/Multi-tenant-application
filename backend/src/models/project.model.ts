import pool from "../db/db.js";

export const createProjectService = async (
    userId: number,
    name: string,
    description: string
) => {

    const membershipResult = await pool.query(
        `
        SELECT organization_id, role
        FROM organization_members
        WHERE user_id = $1
        `,
        [userId]
    );

    const membership = membershipResult.rows[0];

    if (!membership) {
        throw new Error("Organization not found");
    }

    if (membership.role !== "admin") {
        throw new Error("Only admins can create projects");
    }

    const projectResult = await pool.query(
        `
        INSERT INTO projects (
            organization_id,
            name,
            description
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
            membership.organization_id,
            name,
            description
        ]
    );

    return projectResult.rows[0];
};

export const getProjectsService = async (
    userId: number
) => {

    const membershipResult = await pool.query(
        `
        SELECT organization_id
        FROM organization_members
        WHERE user_id = $1
        `,
        [userId]
    );

    const membership = membershipResult.rows[0];

    if (!membership) {
        throw new Error("Organization not found");
    }

    const result = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE organization_id = $1
        ORDER BY created_at DESC
        `,
        [membership.organization_id]
    );

    return result.rows;
};

export const getProjectByIdService = async (
    projectId: number
) => {

    const result = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = $1
        `,
        [projectId]
    );

    return result.rows[0];
};

export const updateProjectService = async (
    projectId: number,
    organizationId: number,
    name: string,
    description: string
) => {

    const result = await pool.query(
        `
        UPDATE projects
        SET
            name = $1,
            description = $2
        WHERE id = $3
        AND organization_id = $4
        RETURNING *
        `,
        [
            name,
            description,
            projectId,
            organizationId
        ]
    );

    return result.rows[0];
};


export const deleteProjectService = async (
    projectId: number,
    organizationId: number
) => {

    const result = await pool.query(
        `
        DELETE FROM projects
        WHERE id = $1
        AND organization_id = $2
        RETURNING *
        `,
        [
            projectId,
            organizationId
        ]
    );

    return result.rows[0];
};