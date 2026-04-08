import { z } from "zod";

export const formulaSchema = z.object({
  formulaId: z.string().optional(),
  tratamientoId: z.string().min(1, "Seleccione un tratamiento"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
});

export const createFormulaSchema = formulaSchema.omit({ formulaId: true });
export const updateFormulaSchema = formulaSchema.partial();

export const detalleFormulaSchema = z.object({
  detalleId: z.number().int().positive().optional(),
  formulaId: z.string(),
  medicamentoId: z.number().int().positive(),
  posologia: z.string().min(1),
  presentacion: z.string().min(1),
  periodicidadUso: z.string().min(1),
  periodoUso: z.string().min(1),
});
