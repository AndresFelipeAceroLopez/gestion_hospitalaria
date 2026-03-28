import { z } from "zod";

/**
 * @file src/modules/especialidades/especialidad.schema.ts
 * @description Esquema de validacion Zod para el modulo de Especialidades.
 */

export const especialidadSchema = z.object({
  especialidadId: z.number().int().positive().optional(),
  nombre: z.string().min(1, "El nombre es obligatorio"),
});

export const createEspecialidadSchema = especialidadSchema.omit({ especialidadId: true });
export const updateEspecialidadSchema = especialidadSchema.partial();

export type EspecialidadSchema = z.infer<typeof especialidadSchema>;
