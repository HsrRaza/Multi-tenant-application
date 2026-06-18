import { signUpService, loginService, logoutService, refreshTokenService, updateRefreshTokenService } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

import type { NextFunction, Request, Response } from "express";
import { handleResponse } from "../utils/standardRes.js";
import pool from "../db/db.js";


export const signUp = async (req: any, res: any, next: any) => {

    const { name, email, password_hash } = req.body;
    try {
        const newUser = await signUpService(name, email, password_hash);

        const accessToken = generateAccessToken({
            userId: newUser.id,
            email: newUser.email,
            organizationId: null,
            role: null
        });

        const refreshToken = generateRefreshToken({
            userId: newUser.id
        });

        await updateRefreshTokenService(newUser.id, refreshToken);

        handleResponse(res, 201, "user created successfully", {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            accessToken,
            refreshToken
        });

    } catch (err) {
        next(err);
    }
}

export const login = async (req: any, res: any, next: any) => {
    try {
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

        await updateRefreshTokenService(auth.user.id, refreshToken);

        handleResponse(
            res, 
            200,
            "Login SuccessFully ",
            {
                user:{
                    id:auth.user.id,
                    name:auth.user.name,
                    email:auth.user.email
                },

                accessToken,
                refreshToken
            }
        );
    } catch (err) {
        next(err);
    }
}

export const profile = async(req:Request ,res:Response, next: NextFunction)=>{
    try {
        const userId = (req.user as any).userId;
        const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);
        if (!result.rows.length) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            user: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
}


export const logout = async(req:Request , res:Response , next:NextFunction)=>{
    
    try {

        const userId = (req.user as any).userId;
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
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const { refreshToken } =
            req.body;

        const decoded =
            await refreshTokenService(
                refreshToken
            );

        const userResult =
            await pool.query(
                `
                SELECT u.id,
                       u.email,
                       om.organization_id,
                       om.role
                FROM users u
                LEFT JOIN organization_members om
                    ON om.user_id = u.id
                WHERE u.id = $1
                `,
                [decoded.userId]
            );

        const user =
            userResult.rows[0];

        const accessToken =
            generateAccessToken({
                userId: user.id,
                email: user.email,
                organizationId:
                    user.organization_id,
                role: user.role
            });

        handleResponse(
            res,
            200,
            "Token refreshed successfully",
            {
                accessToken
            }
        );

    } catch (error) {

        next(error);

    }
};


