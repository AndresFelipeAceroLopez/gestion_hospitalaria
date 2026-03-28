import { z } from "zod";

/**
 * @file src/modules/incapacidades/incapacidad.schema.ts
 */

export const incapacidadSchema = z.object({
  incapacidadId: z.number().int().positive().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha invalido (YYYY-MM-DD)"),
  tratamientoId: z.number().int().positive("El tratamiento es obligatorio"),
});

export const createIncapacidadSchema = incapacidadSchema.omit({ incapacidadId: true });
export const updateIncapacidadSchema = incapacidadSchema.partial();
