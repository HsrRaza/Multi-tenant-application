import type { NextFunction, Request, Response } from "express";
import { assignMemberToProjectService, removeMemberFromProjectService } from "../models/projectMember.model.js";
import { handleResponse } from "../utils/standardRes.js";

export const assignMemberToProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId =
            Number(req.params.projectId);

        const { userId } = req.body;

        const result =
            await assignMemberToProjectService(
                projectId,
                userId
            );

        handleResponse(
            res,
            201,
            "Member assigned successfully",
            result
        );

    } catch (error) {

        next(error);

    }
};


export const removeMemberFromProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId =
            Number(req.params.projectId);

        const userId =
            Number(req.params.userId);

        const result =
            await removeMemberFromProjectService(
                projectId,
                userId
            );

        handleResponse(
            res,
            200,
            "Member removed successfully",
            result
        );

    } catch (error) {

        next(error);

    }
};

