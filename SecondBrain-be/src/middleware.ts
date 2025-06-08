import { NextFunction,Request,Response } from "express";
import  jwt from "jsonwebtoken"



export const middleware = (req : Request,res : Response,next : NextFunction)=>{
    const JWT_SECRATE = process.env.JWT_SECRATE;
    const token = req.headers["authorization"];
    //@ts-ignore
    const verifyToken = jwt.verify(token,JWT_SECRATE);
    if(verifyToken){
        //@ts-ignore
        req.userId = verifyToken.id;
        next();
    }
    else{
        res.json({
            message : "your not authorized..."
        })
    }
}