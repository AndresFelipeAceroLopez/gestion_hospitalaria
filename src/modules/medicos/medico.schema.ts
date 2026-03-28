import { z } from "zod";

/**
 * @file src/modules/medicos/medico.schema.ts
 * @description Esquema de validacion Zod para el modulo de Medicos.
 */

export const medicoSchema = z.object({
  medicoId: z.number().int().positive().optional(),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  especialidadId: z.number().int().positive("La especialidad es obligatoria"),
  hospitalId: z.number().int().positive("El hospital es obligatorio"),
  telefono: z.string().min(1, "El telefono es obligatorio"),
  correoElectronico: z.string().email("Correo electronico invalido"),
});

export const createMedicoSchema = medicoSchema.omit({ medicoId: true });
export const updateMedicoSchema = medicoSchema.partial();

export type MedicoSchema = z.infer<typeof medicoSchema>;
