import type { Request,Response, NextFunction } from "express";
import { createProjectService, deleteProjectService, getProjectByIdService, getProjectsService, updateProjectService } from "../models/project.model.js";
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

export const updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId =
            Number(req.params.projectId);

        const organizationId =
            req.user!.organizationId!;

        const { name, description } =
            req.body;

        const project =
            await updateProjectService(
                projectId,
                organizationId,
                name,
                description
            );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        handleResponse(
            res,
            200,
            "Project updated successfully",
            project
        );

    } catch (error) {
        next(error);
    }
};



export const deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const projectId =
            Number(req.params.projectId);

        const organizationId =
            req.user!.organizationId!;

        const deletedProject =
            await deleteProjectService(
                projectId,
                organizationId
            );

        if (!deletedProject) {
            return res.status(404).json({
                message:
                    "Project not found"
            });
        }

        handleResponse(
            res,
            200,
            "Project deleted successfully",
            deletedProject
        );

    } catch (error) {

        next(error);

    }
};

