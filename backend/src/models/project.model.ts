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

