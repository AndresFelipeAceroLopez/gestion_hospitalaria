import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@lib/supabase/server";

/**
 * GET /auth/callback
 * Maneja los redirects de Supabase para:
 * - Confirmación de correo tras registro (?type=signup)
 * - Recuperación de contraseña (?type=recovery)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === "recovery") {
        // Redirigir a la página de nueva contraseña
        return NextResponse.redirect(`${origin}/auth/update-password`);
      }
      // Registro confirmado → al dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Si algo falla, volver al login con error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
