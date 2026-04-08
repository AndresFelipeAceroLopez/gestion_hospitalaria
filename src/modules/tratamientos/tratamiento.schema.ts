import { z } from "zod";

export const tratamientoSchema = z.object({
  tratamientoId: z.string().optional(),
  visitaId: z.string().min(1, "Seleccione una visita"),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha de inicio inválida"),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha de fin inválida"),
});

export const createTratamientoSchema = tratamientoSchema.omit({ tratamientoId: true });
export const updateTratamientoSchema = tratamientoSchema.partial();
