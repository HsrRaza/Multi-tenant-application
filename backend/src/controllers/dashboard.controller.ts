import type { NextFunction, Request, Response } from "express";
import { getDashboardService } from "../models/dashboard.model.js";
import { handleResponse } from "../utils/standardRes.js";

export const getDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const dashboard =
            await getDashboardService(
                req.user!.organizationId!
            );

        handleResponse(
            res,
            200,
            "Dashboard fetched successfully",
            dashboard
        );

    } catch (error) {
        next(error);
    }
};