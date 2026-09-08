import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../../config/env";
import { auth } from "../../lib/auth";

/**
 * Controller to handle Patient registration.
 * Calls `AuthService.registerPatient`, sets authentication & session cookies,
 * and returns the created patient along with tokens.
 *
 * @route POST /api/v1/auth/register
 * @access Public
 */
const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.registerPatient(payload);
        const { accessToken, refreshToken, token, ...rest } = result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            },
        });
    }
);

/**
 * Controller to handle User authentication (Login).
 * Calls `AuthService.loginUser`, sets authentication & session cookies,
 * and returns user tokens and session data.
 *
 * @route POST /api/v1/auth/login
 * @access Public
 */
const loginUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.loginUser(payload);
        const { accessToken, refreshToken, token, ...rest } = result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            },
        });
    }
);

const getMe = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const result = await AuthService.getMe(user);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User fetched successfully",
            data: result,
        });
    }
);


const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken || req.body?.refreshToken;
        const betterAuthSessionToken =
            req.cookies["better-auth-session"] ||
            req.cookies["better-auth.session_token"] ||
            req.cookies["better-auth-session-token"] ||
            req.body?.sessionToken ||
            req.body?.token ||
            req.headers["x-session-token"] ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization);

        if (!refreshToken || !betterAuthSessionToken) {
            throw new AppError(status.BAD_REQUEST, "No refresh token or session token found");
        }
        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken as string);

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New token generated successfully",
            data: {
                sessionToken,
                accessToken,
                refreshToken: newRefreshToken,
            },
        });
    }
);

const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const betterAuthSessionToken =
            req.cookies["better-auth-session"] ||
            req.cookies["better-auth.session_token"] ||
            req.cookies["better-auth-session-token"] ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization);

        if (!betterAuthSessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No session token provided.");
        }

        const result = await AuthService.chnagePassword(payload, betterAuthSessionToken);

        const {accessToken,refreshToken,token}=result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result,
        });
    }
);


// log out user

const logOutUser = catchAsync(
    async (req: Request, res: Response) => {
        const betterAuthSessionToken =
            req.cookies["better-auth-session-token"];

        const result = await AuthService.logOutUser(betterAuthSessionToken);

        tokenUtils.storeTokenIntoCookie(res,'');
        tokenUtils.storeRefreshTokenIntoCookie(res,'');
        tokenUtils.setBetterAuthSessionCookie(res,'');

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged out successfully",
            data: result,
        });
    }
);


const verifyEmail = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        await AuthService.verifyEmail(email, otp);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Email verified successfully",
        });
    }
)

const forgetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await AuthService.forgetPassword(email);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset OTP sent to email successfully",
        });
    }
)

const resetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await AuthService.resetPassword(email, otp, newPassword);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password reset successfully",
        });
    }
)
const googleLogin = catchAsync((req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", {
        callbackURL: callbackURL,
        betterAuthUrl: envVars.BETTER_AUTH_URL,
        frontendUrl: envVars.FRONTEND_URL,
        redirectPath: redirectPath,
    });
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = (req.query.redirect as string) || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if (!sessionToken) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers: {
            Cookie: `better-auth.session_token=${sessionToken}`,
        },
    });

    if (!session) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
    }

    if (session && !session.user) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
    }

    const result = await AuthService.googleLoginSuccess(session);

    const { accessToken, refreshToken } = result;

    tokenUtils.storeTokenIntoCookie(res, accessToken);
    tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

    res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});

const handleOAuthError = catchAsync((req: Request, res: Response) => {
    const error = req.query.error as string || "oauth_failed";
    res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
})

export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logOutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    googleLogin,
    googleLoginSuccess,
    handleOAuthError
};
