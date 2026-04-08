import { z } from "zod";

/**
 * @file src/modules/incapacidades/incapacidad.schema.ts
 */

export const incapacidadSchema = z.object({
  incapacidadId: z.string().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha invalido (YYYY-MM-DD)"),
  tratamientoId: z.string().min(1, "Seleccione un tratamiento"),
});

export const createIncapacidadSchema = incapacidadSchema.omit({ incapacidadId: true });
export const updateIncapacidadSchema = incapacidadSchema.partial();
