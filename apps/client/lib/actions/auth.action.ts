"use server"

import { create } from "domain";
import { loginSchema, LoginSchema, signupSchema, SignupSchema } from "../schema/auth.schema"
import { redis } from "../utils/redis/client";
import { createAuthorizedNatsRequest, createNatsRequest } from "../utils/server/create-nats-request";
import { getCookie, removeCookie, setCookie } from "../utils/server/get-cookie";
import { redirect } from "next/navigation";


export const loginAction = async (data: LoginSchema) => {
    const validData = await loginSchema.validate(data);
    const response = await createNatsRequest("auth.login", validData)
    await redis.set(`auth-${response.token}`, JSON.stringify(response.user));
    await setCookie(process.env.AUTH_COOKIE_NAME!, response.token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
    return response
}


export const signUpAction = async (data: SignupSchema) => {
    const validData = await signupSchema.validate(data);
    const response = await createNatsRequest("auth.register", validData)
    await redis.set(`auth-${response.token}`, JSON.stringify(response.user));
    await setCookie(process.env.AUTH_COOKIE_NAME!, response.token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
    return response
}



export async function logout(redirectAfterLogin = true) {
    const idToken = await getCookie(process.env.AUTH_COOKIE_NAME!);
    if (idToken) {
        await redis.del(`auth-${idToken}`);
    }
    await removeCookie(process.env.AUTH_COOKIE_NAME!);
    if (redirectAfterLogin) {
        throw new Error(redirect('/'));
    }
}
