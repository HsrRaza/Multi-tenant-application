import type { Request, Response, NextFunction } from "express";

const errorHandling = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).json({
    sucess:false,
    status:500,
    message : "Something went wrong",
    error:err.message
  })
  
}

export default errorHandling;