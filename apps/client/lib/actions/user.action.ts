import { v7 } from "uuid";
import { IUser } from "../types/user.interface";
import { redis } from "../utils/redis/client";
import { getCookie } from "../utils/server/get-cookie";
import { connectToNats, request as natsRequest } from "../utils/nats/client";

export async function getAuthUser() {
    const idToken = await getCookie(process.env.AUTH_COOKIE_NAME!);
    if (!idToken) return;

    const cachedUserString = await redis.get(`auth-${idToken}`);
    if (cachedUserString) {
        const user = JSON.parse(cachedUserString) as IUser;
        return user;
    }

    const natsClient = await connectToNats();
    const response = await natsRequest<{ message: string, user: IUser } | { err: { message: string } }>(
        natsClient,
        'user.getOwnData',
        JSON.stringify({
            id: v7(),
            data: { authorization: idToken },
        }),
    );

    if ('err' in (response as any)) return;
    return (response as { message: string, user: IUser }).user;
}
