import { z } from "zod";

/**
 * @file src/modules/tratamientos/tratamiento.schema.ts
 */

export const tratamientoSchema = z.object({
  tratamientoId: z.number().int().positive().optional(),
  visitaId: z.number().int().positive(),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createTratamientoSchema = tratamientoSchema.omit({ tratamientoId: true });
export const updateTratamientoSchema = tratamientoSchema.partial();
