/**
 * @file middleware.ts (RAIZ del proyecto, junto a package.json)
 * @description Middleware global de autenticación.
 * 
 * Responsabilidades (SRP aplicado):
 * 1. Refrescar el token de sesión de Supabase en cada request.
 * 2. Proteger rutas del dashboard que requieren autenticación.
 * 3. Redirigir usuarios no autenticados al login.
 * 4. Redirigir usuarios autenticados fuera del login.
 * 
 * @principle SRP: este middleware hace SOLO gestión de sesion/auth
 */

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "./src/lib/supabase/middleware";

// Rutas que NO requieren autenticación
const PUBLIC_PATHS = [
  "/login",
  "/registro",
  "/auth",  // Callbacks de Supabase (confirmación, recuperación)
  "/",      // Pagina de inicio publica
];

export async function proxy(request: NextRequest) {
  // Crear response base que pasara por el middleware
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Crear cliente Supabase para el middleware
  const supabase = createMiddlewareSupabaseClient(request, response);

  // PASO CRITICO: Verificar la sesión en cada request.
  // getUser() contacta al servidor de Supabase Auth para mayor seguridad.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const session = user ? { user } : null;

  const pathname = request.nextUrl.pathname;

  // Verificar si la ruta actual es publica
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));

  // Si no hay sesión y la ruta es protegida -> redirigir al login
  if (!session && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    // Guardar la URL original para redirigir después del login
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay sesión y el usuario intenta ir al login o registro -> redirigir al dashboard
  if (session && (pathname === "/login" || pathname === "/registro")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Continuar con la request normal
  return response;
}

// Configurar en que rutas aplica el middleware
// El patron excluye archivos estaticos y de imagen
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};