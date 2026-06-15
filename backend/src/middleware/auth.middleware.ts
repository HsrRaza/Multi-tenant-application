import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken"

export const authenticate= (req:Request, res:Response, next:NextFunction)=>{
   
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                status:401,
                message:"Acess token is missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({
                status:401,
                message:"Invalid authorization format"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        );

          req.user = decoded
        next();


    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        })
    }
     
};