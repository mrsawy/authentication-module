
import { IUser } from '@/lib/types/user.interface';
import { connectToNats, request as natsRequest } from '@/lib/utils/nats/client';
import { redis } from '@/lib/utils/redis/client';
import { createAuthorizedNatsRequest } from '@/lib/utils/server/create-nats-request';
import { getCookie } from '@/lib/utils/server/get-cookie';
import { NextRequest, NextResponse } from 'next/server';
import { v7 } from 'uuid';
export async function GET(request: NextRequest) {
    
    const authCookie = await getCookie(process.env.AUTH_COOKIE_NAME!);
    if (!authCookie) return new NextResponse(undefined, { status: 401 })
    let userString = await redis.get(`auth-${authCookie}`,);
    let user: IUser | undefined;
    if (userString) user = JSON.parse(userString) as IUser
    if (!userString) {
        const natsClient = await connectToNats();
        const response = await natsRequest<{ message: string, user: IUser }>(
            natsClient,
            'user.getOwnData',
            JSON.stringify({
                id: v7(),
                data: { authorization: authCookie },
            }),
        );

        if ('err' in response) {
            return new NextResponse(undefined, {
                status: 401,
            });
        }
        user = response.user
    }

    if (!user) return new NextResponse(undefined, { status: 401 })

    const response = new NextResponse(JSON.stringify(user));
    response.headers.set('Content-Type', 'application/json');

    return response;
}


createAuthorizedNatsRequest
