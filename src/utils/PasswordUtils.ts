import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { Request } from "express";
import {AuthPayload} from "../@types/Auth.dto";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
) => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: "1h" });
};

export const ValidateSignature = async (req: Request) => {
    const token = req.get("Authorization");
    console.log(token);
    if (token) {
        try {
            // remove the quotes from the token
            const signature = token.replace(/['"]+/g, '')
            const payload = (await jwt.verify(
                signature.split(" ")[1],
                APP_SECRET
                //? this is called cassting
            )) as AuthPayload;

            req.user = payload;

            return true;
        } catch (error) {
            return false;
        }
    } else {
        return false;
    }
};