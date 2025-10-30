import { type NextRequest, NextResponse } from 'next/server';
import { NOT_AUTHED_ONLY_ROUTES, PUBLIC_PREFIX_ROUTES, PUBLIC_ROUTES } from './lib/route.config';
import { IUser } from './lib/types/user.interface';





function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.includes(pathname) || PUBLIC_ROUTES.includes(`/${pathname}`)) {
        return true
    } else if (PUBLIC_PREFIX_ROUTES.some((prefix) => pathname.startsWith(prefix))) {
        return true
    }
    return false
}

export default async function proxy(request: NextRequest & { user?: IUser }) {
    try {
        const { pathname } = request.nextUrl;
        const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, '');

        const isPublic = isPublicRoute(pathWithoutLocale);
        const isNotAuthedOnly = NOT_AUTHED_ONLY_ROUTES.includes(pathWithoutLocale);
        const hasCookie = request.cookies.has(process.env.AUTH_COOKIE_NAME!);

        // If user has auth cookie, verify it
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

                    // Authenticated user trying to access login/signup
                    if (isNotAuthedOnly) {
                        return NextResponse.redirect(new URL('/private', request.url));
                    }

                    // Authenticated user accessing any other route
                    return NextResponse.next();
                } else {
                    console.error("Expected JSON but got:", await response.text());
                    // Invalid response - clear cookie and redirect to login
                    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
                    redirectResponse.cookies.delete(process.env.AUTH_COOKIE_NAME!);
                    return redirectResponse;
                }
            } else {
                // Invalid/expired cookie
                const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
                redirectResponse.cookies.delete(process.env.AUTH_COOKIE_NAME!);
                return redirectResponse;
            }
        }

        // No auth cookie
        if (isPublic) {
            // Allow access to public routes
            return NextResponse.next();
        } else {
            // Redirect to login for protected routes
            return NextResponse.redirect(new URL('/login', request.url));
        }

    } catch (error) {
        console.error("error from middleware:", error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',

    ]
};

