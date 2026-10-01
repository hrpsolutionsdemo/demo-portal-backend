import { Request, NextFunction, Response } from "express";
import {ValidateSignature} from "../utils/PasswordUtils";

export const Authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const signature = await ValidateSignature(req);
    console.log(signature);
    if (signature) {
        return next();
    } else {
        return res.json({message: "User Not authorised"});
    }
}