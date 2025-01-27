import dotenv from "dotenv";
dotenv.config();

export const INFOBIP_API_KEY: string = process.env.INFOBIP_API_KEY || "";
