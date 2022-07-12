import { ErrorRequestHandler, NextFunction, Request, Response } from "express";


export function handdleErrorMiddleware(error:ErrorRequestHandler,req:Request,res:Response,next:NextFunction) {
    console.log(error);
    if (error) {
      return res.status(403).send(error);
    }
  
    res.sendStatus(500);
}