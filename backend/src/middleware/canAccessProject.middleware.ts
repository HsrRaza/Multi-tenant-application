import type { Request, Response, NextFunction } from "express";
import pool from "../db/db.js";

export const canAccessProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId = Number(req.params.projectId);

        const membershipResult = await pool.query(
            `
            SELECT organization_id, role
            FROM organization_members
            WHERE user_id = $1
            `,
            [req.user!.userId]
        );

        const membership = membershipResult.rows[0];

        if (!membership) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Admin
        if (membership.role === "admin") {

            const projectResult = await pool.query(
                `
                SELECT *
                FROM projects
                WHERE id = $1
                AND organization_id = $2
                `,
                [
                    projectId,
                    membership.organization_id
                ]
            );

            if (!projectResult.rows.length) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            return next();
        }

        // Member
        const projectResult = await pool.query(
            `
            SELECT *
            FROM project_members
            WHERE project_id = $1
            AND user_id = $2
            `,
            [
                projectId,
                req.user!.userId
            ]
        );

        if (!projectResult.rows.length) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();

    } catch (error) {

        next(error);

    }
};