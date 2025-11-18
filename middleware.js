// middleware.js (Version corrigée)
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Chemins publics (pas d'auth requise)
  // Note: les "segment groups" (ex: (auth)) n'apparaissent pas dans l'URL
  const publicPrefixes = new Set(["/login", "/register"]);
  const isPublicPath =
    publicPrefixes.has(pathname) ||
    [...publicPrefixes].some((p) => pathname.startsWith(p + "/"));

  // 1) Utilisateur non authentifié essayant d'accéder à une page protégée
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2) Utilisateur authentifié essayant d'accéder à une page publique (login/register)
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
