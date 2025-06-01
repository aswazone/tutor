import { NODE_ENV } from "@/config/env.config";
import { Response } from "express";

export function setCookie(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
        domain: NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
        path: '/'
    });
}

export function deleteCookie(res: Response) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
        domain: NODE_ENV === 'production' ? process.env.DOMAIN : 'localhost',
        path: '/'
    });
}