import type { Request,Response, NextFunction } from "express";
import { createProjectService, getProjectByIdService, getProjectsService } from "../models/project.model.js";
import { handleResponse } from "../utils/standardRes.js";

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { name, description } = req.body;

        const project =
            await createProjectService(
                req.user!.userId,
                name,
                description
            );

        handleResponse(
            res,
            201,
            "Project created successfully",
            project
        );

    } catch (error) {

        next(error);

    }
};

export const getProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projects =
            await getProjectsService(
                req.user!.userId
            );

        handleResponse(
            res,
            200,
            "Projects fetched successfully",
            projects
        );

    } catch (error) {

        next(error);

    }
};



export const getProjectById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId =
            Number(req.params.projectId);

        const project =
            await getProjectByIdService(
                projectId
            );

        handleResponse(
            res,
            200,
            "Project fetched successfully",
            project
        );

    } catch (error) {

        next(error);

    }
};


