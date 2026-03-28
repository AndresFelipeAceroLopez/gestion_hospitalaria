import { z } from "zod";

/**
 * @file src/modules/formulas/formula.schema.ts
 */

export const formulaSchema = z.object({
  formulaId: z.number().int().positive().optional(),
  tratamientoId: z.number().int().positive(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createFormulaSchema = formulaSchema.omit({ formulaId: true });
export const updateFormulaSchema = formulaSchema.partial();

export const detalleFormulaSchema = z.object({
  detalleId: z.number().int().positive().optional(),
  formulaId: z.number().int().positive(),
  medicamentoId: z.number().int().positive(),
  posologia: z.string().min(1),
  presentacion: z.string().min(1),
  periodicidadUso: z.string().min(1),
  periodoUso: z.string().min(1),
});
