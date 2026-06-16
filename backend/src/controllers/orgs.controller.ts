import type { Request, Response } from "express";
import { handleResponse } from "../utils/standardRes.js";

export const createOrganization = async(req:Request, res:Response)=>{
        const {name} =req.body;

        const organization = await createOrganization(
            req.user.userId,
            name
        )

        handleResponse(res, 200 ,"Organization created successfully", organization)
        
     
 }
