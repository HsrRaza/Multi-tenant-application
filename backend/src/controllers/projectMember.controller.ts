import type { NextFunction, Request, Response } from "express";
import { assignMemberToProjectService,  getProjectWithMembersService,  removeMemberFromProjectService } from "../models/projectMember.model.js";
import { handleResponse } from "../utils/standardRes.js";

export const assignMemberToProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId =
            Number(req.params.projectId);

        const { userId } =
            req.body;

        const organizationId =
            req.user!.organizationId!;

        const result =
            await assignMemberToProjectService(
                projectId,
                userId,
                organizationId
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

        const organizationId =
            req.user!.organizationId!;

        const result =
            await removeMemberFromProjectService(
                projectId,
                userId,
                organizationId
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



export const getProjectMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId =
            Number(req.params.projectId);

        const members =
            await getProjectWithMembersService(
                projectId
            );

        handleResponse(
            res,
            200,
            "Project members fetched successfully",
            members
        );

    } catch (error) {

        next(error);
    }
};

