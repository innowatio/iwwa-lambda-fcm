import dotenv from "dotenv";

dotenv.config({silent: true});

export const GOOGLE_SERVER_API_KEY = process.env.GOOGLE_SERVER_API_KEY;
export const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/test";
export const USER_COLLECTION = "users";
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
