import { ErrorRequestHandler, NextFunction, Request, Response } from "express";


export function handdleErrorMiddleware(error,req:Request,res:Response,next:NextFunction) {
    console.log(error);
    if (error) {
      return res.status(error.status).send(error.message)
    }
  
    res.sendStatus(500);
}