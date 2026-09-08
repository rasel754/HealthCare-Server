/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Role, UserStatus } from "../../generated/prisma/enums";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import cookieUtils from "../utils/cookie";
import jwtUtils from "../utils/jwt";
import { envVars } from "../../config/env";


export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Session Token Extraction
        const sessionToken =
            cookieUtils.getCookie(req, "better-auth-session") ||
            cookieUtils.getCookie(req, "better-auth.session_token") ||
            cookieUtils.getCookie(req, "better-auth-session-token") ||
            (req.headers["x-session-token"] as string) ||
            (req.headers["session-token"] as string);

        // Access Token Extraction
        const accessToken =
            cookieUtils.getCookie(req, 'accessToken') ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization) ||
            (req.headers['x-access-token'] as string);

        if (!sessionToken && !accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No authentication token provided.');
        }

        let user: any = null;

        // 1. Verify Session Token if present
        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date(),
                    }
                },
                include: {
                    user: true,
                }
            });

            if (sessionExists && sessionExists.user) {
                user = sessionExists.user;

                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt);
                const createdAt = new Date(sessionExists.createdAt);

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

                if (percentRemaining < 20) {
                    res.setHeader('X-Session-Refresh', 'true');
                    res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                    res.setHeader('X-Time-Remaining', timeRemaining.toString());
                }
            }
        }

        // 2. Verify Access Token if present
        if (accessToken) {
            const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
            if (verifiedToken.success && verifiedToken.data) {
                if (!user) {
                    user = await prisma.user.findUnique({
                        where: { id: verifiedToken.data.userId },
                    });
                }
            } else if (!user) {
                throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
            }
        }

        if (!user) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User session or token is invalid.');
        }

        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is not active.');
        }

        if (user.isDeleted) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is deleted.');
        }

        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }

        req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
        };

        next();
    } catch (error: any) {
        next(error);
    }
};