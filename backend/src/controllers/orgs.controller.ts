import type { NextFunction, Request, Response } from "express";
import { handleResponse } from "../utils/standardRes.js";
import { getMyOrganizationService, getOrganizationMembersService, joinOrganizationService } from "../models/orgs.model.js";

export const createOrganization = async(req:Request, res:Response)=>{
        const {name} =req.body;

        const organization = await createOrganization(
            req.user.userId,
            name
        )

        handleResponse(res, 200 ,"Organization created successfully", organization)
        
     
 }

 export const joinOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { inviteCode } = req.body;

        const organization =
            await joinOrganizationService(
                req.user!.userId,
                inviteCode
            );

        handleResponse(
            res,
            200,
            "Organization joined successfully",
            organization
        );

    } catch (error) {

        next(error);

    }
};

export const getMyOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const organizations =
            await getMyOrganizationService(
                req.user!.userId
            );

        handleResponse(
            res,
            200,
            "Organizations fetched successfully",
            organizations
        );

    } catch (error) {

        next(error);

    }
};

export const getOrganizationMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const organizations =
            await getMyOrganizationService(
                req.user!.userId
            );

        if (!organizations.length) {
            throw new Error(
                "User is not part of any organization"
            );
        }

        const organizationId =
            organizations[0].id;

        const members =
            await getOrganizationMembersService(
                organizationId
            );

        handleResponse(
            res,
            200,
            "Organization members fetched successfully",
            members
        );

    } catch (error) {

        next(error);

    }
};
