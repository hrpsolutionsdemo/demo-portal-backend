import { AuthPayload } from "./Auth.dto";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export {};
