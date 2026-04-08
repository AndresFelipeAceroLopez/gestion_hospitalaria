import { z } from "zod";

export const ordenExamenSchema = z.object({
  ordenExamenId: z.string().optional(),
  visitaId: z.string().min(1, "Seleccione una visita"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
});

export const createOrdenExamenSchema = ordenExamenSchema.omit({ ordenExamenId: true });
export const updateOrdenExamenSchema = ordenExamenSchema.partial();

export const detalleExamenSchema = z.object({
  detalleExamenId: z.number().int().positive().optional(),
  ordenExamenId: z.string(),
  nombreExamen: z.string().min(1),
  tipoExamen: z.string().min(1),
  indicaciones: z.string().min(1),
});
