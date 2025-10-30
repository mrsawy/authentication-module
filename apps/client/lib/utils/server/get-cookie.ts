'use server';

import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';




export async function getCookie(name: string) {
    return (await cookies()).get(name)?.value;
}
export async function setCookie(
    name: string,
    value: string,
    config?: Partial<ResponseCookie>,
) {
    return (await cookies()).set(name, value, config);
}
export async function removeCookie(name: string) {
    return (await cookies()).delete(name);
}

