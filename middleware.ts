
import {NextRequest,NextResponse} from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from './lib/session/session';

const protectedRoutes=['/'];
const publicRoutes=['/sign-in','/sign-up','/'];

export default async function middleware(req:NextRequest) {

    const path=req.nextUrl.pathname
    const isProtectedRoute=protectedRoutes.includes(path);
    const isPublicRoute=publicRoutes.includes(path);

    const cookie=cookies().get('session')?.value;
    const session=await decrypt(cookie);

    if(isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/sign-in',req.nextUrl));
    }

    if(isPublicRoute && session && (req.nextUrl.pathname.startsWith('/sign-in') ||
        req.nextUrl.pathname.startsWith('/sign-up') && !req.nextUrl.pathname.startsWith('/onBoard')
    )) {
        return NextResponse.redirect(new URL('/',req.nextUrl))
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
