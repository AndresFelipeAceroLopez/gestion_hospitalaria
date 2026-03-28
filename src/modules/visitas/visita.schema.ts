import { z } from "zod";

/**
 * @file src/modules/visitas/visita.schema.ts
 * @description Esquema de validacion Zod para el modulo de Visitas.
 */

export const visitaSchema = z.object({
  visitaId: z.number().int().positive().optional(),
  pacienteId: z.number().int().positive("El paciente es obligatorio"),
  medicoId: z.number().int().positive("El medico es obligatorio"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha invalido (YYYY-MM-DD)"),
  hora: z.string().regex(/^\d{2}:\d{2}$/, "Formato de hora invalido (HH:MM)"),
});

export const createVisitaSchema = visitaSchema.omit({ visitaId: true });
export const updateVisitaSchema = visitaSchema.partial();

export type VisitaSchema = z.infer<typeof visitaSchema>;

// Signos Vitales
export const signoVitalSchema = z.object({
  signoVitalId: z.number().int().positive().optional(),
  visitaId: z.number().int().positive(),
  frecuenciaCardiaca: z.number().min(0),
  presionArterial: z.string().min(1),
  frecuenciaRespiratoria: z.number().min(0),
  temperatura: z.number().min(0),
  saturacionOxigeno: z.number().min(0),
});
