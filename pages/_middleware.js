import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware (req) {
    // Token will exist if the user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET})
    const {pathname} = req.nextUrl
    const url = req.nextUrl.clone()
    url.pathname = '/login'

    // Allow requests if the following is true
    // 1) It's a request for a next-auth session & provider fetching
    // 2) the token exists
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next()
    }

    // #TODO: if they have a token and try to access '/login' then redirect to home page

    // Redirect them to login if they don't have token AND are requesting a protected route
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(url)
    }
}