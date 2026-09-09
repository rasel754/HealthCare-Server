import dotenv from "dotenv";
dotenv.config();


interface envConfig {
    PORT: string,
    NODE_ENV: string,
    BETTER_AUTH_SECRET: string,
    BETTER_AUTH_URL: string,
    DATABASE_URL: string,
    ACCESS_TOKEN_SECRET: string,
    REFRESH_TOKEN_SECRET: string,
    ACCESS_TOKEN_EXPIRES_IN: string,
    REFRESH_TOKEN_EXPIRES_IN: string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string,
    EMAIL_SENDER: {
        SMPT_USER: string,
        SMPT_PASS: string,
        SMPT_HOST: string,
        SMPT_PORT: string,
        SMPT_FROM: string,
    },
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    GOOGLE_CALLBACE_URL: string,
    FRONTEND_URL: string,
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_API_KEY: string,
        CLOUDINARY_API_SECRET: string,
    }
    STRIPE:{
        STRIPE_SECRET_KEY: string,
        STRIPE_WEBHOOK_SECRET: string,
    },
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    RAG:{
        OPENROUTER_API_KEY: string,
        OPENROUTER_EMBEDDING_MODEL: string,
        OPENROUTER_LLM_MODEL: string,
    },
    REDIS_URL: string,

}


const loadEnvVariable = (): envConfig => {
    const missingVars: string[] = [];
    const requireEnvVariable = [
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL',
        'DATABASE_URL',
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SECRET',
        'FRONTEND_URL',
    ];

    requireEnvVariable.forEach((variable) => {
        if (!process.env[variable]) {
            missingVars.push(variable);
        }
    });

    if (missingVars.length > 0) {
        console.warn(`[Config Warning] Missing environment variables on server: ${missingVars.join(', ')}`);
    }

    return {
        PORT: process.env.PORT || "5000",
        NODE_ENV: process.env.NODE_ENV || "production",
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
        DATABASE_URL: process.env.DATABASE_URL || "",
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret",
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret",
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN || "1d",
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE || "1d",
        EMAIL_SENDER: {
            SMPT_USER: process.env.EMAIL_SENDER_SMTP_USER || "",
            SMPT_PASS: process.env.EMAIL_SENDER_SMTP_PASS || "",
            SMPT_HOST: process.env.EMAIL_SENDER_SMTP_HOST || "",
            SMPT_PORT: process.env.EMAIL_SENDER_SMTP_PORT || "587",
            SMPT_FROM: process.env.EMAIL_SENDER_SMTP_FROM || "",
        },
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
        GOOGLE_CALLBACE_URL: process.env.GOOGLE_CALLBACE_URL || "",
        FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
        },
        STRIPE:{
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
            STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
        },
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL || "",
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "",
        RAG:{
            OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
            OPENROUTER_EMBEDDING_MODEL: process.env.OPENROUTER_EMBEDDING_MODEL || "",
            OPENROUTER_LLM_MODEL: process.env.OPENROUTER_LLM_MODEL || "",
        },
        REDIS_URL: process.env.REDIS_URL || "",
    }
}

export const envVars = loadEnvVariable()