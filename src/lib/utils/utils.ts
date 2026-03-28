/**
 * @file src/lib/utils.ts
 * @description Funciones utilitarias compartidas en toda la aplicación.
 */

/**
 * Combina clases CSS condicionalmente (sin dependencias externas).
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formatea una fecha ISO "YYYY-MM-DD" al formato legible "DD/MM/YYYY".
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
    return d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(date);
  }
}

/**
 * Formatea una fecha con mes abreviado: "15 ene 2024".
 */
export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
    return d.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(date);
  }
}

/**
 * Retorna el nombre completo a partir de nombre y apellido.
 */
export function getFullName(nombre: string, apellido: string): string {
  return `${nombre} ${apellido}`.trim();
}

/**
 * Retorna las iniciales de nombre y apellido.
 */
export function getInitials(nombre: string, apellido: string): string {
  const n = nombre?.[0]?.toUpperCase() ?? "";
  const a = apellido?.[0]?.toUpperCase() ?? "";
  return n + a || "?";
}

/**
 * Calcula la edad en años a partir de una fecha de nacimiento "YYYY-MM-DD".
 */
export function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nac = new Date(fechaNacimiento + "T00:00:00");
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

/**
 * Trunca un texto a un máximo de caracteres con "…".
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}
