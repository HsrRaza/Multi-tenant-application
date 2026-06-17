import pool from "../db/db.js";

export const assignMemberToProjectService = async (
    projectId: number,
    userId: number
) => {

    const result = await pool.query(
        `
        INSERT INTO project_members (
            project_id,
            user_id
        )
        VALUES ($1, $2)
        RETURNING *
        `,
        [projectId, userId]
    );

    return result.rows[0];
};


export const removeMemberFromProjectService = async (
    projectId: number,
    userId: number
) => {

    const result = await pool.query(
        `
        DELETE FROM project_members
        WHERE project_id = $1
        AND user_id = $2
        RETURNING *
        `,
        [projectId, userId]
    );

    return result.rows[0];
};

