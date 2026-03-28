import { z } from "zod";

/**
 * @file src/modules/examenes/examen.schema.ts
 */

export const ordenExamenSchema = z.object({
  ordenExamenId: z.number().int().positive().optional(),
  visitaId: z.number().int().positive(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createOrdenExamenSchema = ordenExamenSchema.omit({ ordenExamenId: true });
export const updateOrdenExamenSchema = ordenExamenSchema.partial();

export const detalleExamenSchema = z.object({
  detalleExamenId: z.number().int().positive().optional(),
  ordenExamenId: z.number().int().positive(),
  nombreExamen: z.string().min(1),
  tipoExamen: z.string().min(1),
  indicaciones: z.string().min(1),
});
