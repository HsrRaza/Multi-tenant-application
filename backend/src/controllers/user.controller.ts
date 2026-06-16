import { signUpService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService, loginService, logoutService } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

import type { NextFunction, Request, Response } from "express";
import { handleResponse } from "../utils/standardRes.js";


export const signUp = async (req: any, res: any, next: any) => {

    const { name, email, password_hash } = req.body;
    try {
        const newUser = await signUpService(name, email, password_hash);

        console.log(newUser);

        handleResponse(res, 201, "user created successfully", newUser)

    } catch (err) {
        next(err);
    }
}

export const login = async (req: any, res: any) => {
    const { email, password } = req.body

    const auth = await loginService(email, password)

    const accessToken = generateAccessToken({
        userId: auth.user.id,
        email: auth.user.email,
        organizationId: auth.membership?.organization_id,
        role: auth.membership?.role

    });

    const refreshToken = generateRefreshToken({
        userId: auth.user.id
    });

    handleResponse(
        res, 
        200,
        "Login SuccessFully ",
        {
            user:{
                id:auth.user.id,
                name:auth.user.name,
                emai:auth.user.email
            },

            accessToken,
            refreshToken
        }
    );
}

export const profile = async(req:Request ,res:Response)=>{

    const user  = req.user
    res.json({
        user:user
    })
}


export const logout = async(req:Request , res:Response , next:NextFunction)=>{
    
    try {

        const userId = req.user!.id;
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                status: 400,
                message: "Refresh token required"
            });
        }

        await logoutService(userId , refreshToken);

        handleResponse(
            res,
            200,
            "Logout successful",
            null
        );

    } catch (error) {

        next(error);

    }
}
