import { type NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES } from './lib/route.config';
import { IUser } from './lib/types/user.interface';

function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.includes(pathname) || PUBLIC_ROUTES.includes(`/${pathname}`)) {
        return true;
    }
    return false;
}

export default async function middleware(request: NextRequest & { user?: IUser }) {
    try {
        const { pathname } = request.nextUrl;
        const isPublic = isPublicRoute(pathname);
        const hasCookie = request.cookies.has(process.env.AUTH_COOKIE_NAME!);
        
        if (isPublic) {
            return NextResponse.next();
        }
        // If user has auth cookie, verify it first
        if (hasCookie) {
            const apiUrl = new URL("/api/user", request.url);
            const response = await fetch(apiUrl, {
                headers: {
                    cookie: `${process.env.AUTH_COOKIE_NAME}=${request.cookies.get(process.env.AUTH_COOKIE_NAME!)?.value}`,
                },
            });

            if (response.ok) {
                const contentType = response.headers.get("content-type") || "";
                if (contentType.includes("application/json")) {
                    request.user = (await response.json()) as IUser;
                    
                    // Authenticated user accessing any other route - allow
                    return NextResponse.next();
                } else {
                    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
                    redirectResponse.cookies.delete(process.env.AUTH_COOKIE_NAME!);
                    return redirectResponse;
                }
            } else {
                // Invalid/expired cookie - clear it
                const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
                redirectResponse.cookies.delete(process.env.AUTH_COOKIE_NAME!);
                return redirectResponse;
            }
        }

        // No cookie and not public - redirect to login
        return NextResponse.redirect(new URL('/login', request.url));

    } catch (error) {
        console.error("Error from middleware:", error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
    ]
};