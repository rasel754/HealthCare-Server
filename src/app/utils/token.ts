import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwtUtils from "./jwt";
import { envVars } from "../../config/env";
import cookieUtils from "./cookie";
import ms, { StringValue } from "ms"
import { Response } from "express";

const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions)
    return accessToken;
}
const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions)
    return refreshToken;
}


const storeTokenIntoCookie = (res: Response, token: string) => {
    const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);
    cookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
        path: '/',
        maxAge: typeof maxAge === 'number' ? maxAge : 1000 * 60 * 60 * 24
    })
}


const storeRefreshTokenIntoCookie = (res: Response, refreshToken: string) => {
    const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue);
    cookieUtils.setCookie(res, 'refreshToken', refreshToken, {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
        path: '/',
        maxAge: typeof maxAge === 'number' ? maxAge : 1000 * 60 * 60 * 24 * 7
    })
}



const setBetterAuthSessionCookie = (res: Response, token: string) => {
    const maxAge = ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue);
    cookieUtils.setCookie(res, 'better-auth.session_token', token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: typeof maxAge === 'number' ? maxAge : 1000 * 60 * 60 * 24
    })
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    storeTokenIntoCookie,
    storeRefreshTokenIntoCookie,
    setBetterAuthSessionCookie
}