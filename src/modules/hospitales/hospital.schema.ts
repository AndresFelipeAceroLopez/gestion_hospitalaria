import { z } from "zod";

/**
 * @file src/modules/hospitales/hospital.schema.ts
 * @description Esquema de validacion Zod para el modulo de Hospitales.
 */

export const hospitalSchema = z.object({
  hospitalId: z.number().int().positive().optional(), // Opcional para creacion
  nombre: z.string().min(1, "El nombre es obligatorio"),
  direccion: z.string().min(1, "La direccion es obligatoria"),
  nit: z.string().min(1, "El NIT es obligatorio"),
  telefono: z.string().min(1, "El telefono es obligatorio"),
});

export const createHospitalSchema = hospitalSchema.omit({ hospitalId: true });
export const updateHospitalSchema = hospitalSchema.partial();

export type HospitalSchema = z.infer<typeof hospitalSchema>;