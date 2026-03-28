import { z } from "zod";

/**
 * @file src/modules/pacientes/paciente.schema.ts
 * @description Esquema de validacion Zod para el modulo de Pacientes.
 */

export const pacienteSchema = z.object({
  pacienteId: z.number().int().positive().optional(),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha invalido (YYYY-MM-DD)"),
  sexo: z.string().min(1, "El sexo es obligatorio"),
  direccion: z.string().min(1, "La direccion es obligatoria"),
  telefono: z.string().min(1, "El telefono es obligatorio"),
  correoElectronico: z.string().email("Correo electronico invalido"),
});

export const createPacienteSchema = pacienteSchema.omit({ pacienteId: true });
export const updatePacienteSchema = pacienteSchema.partial();

export type PacienteSchema = z.infer<typeof pacienteSchema>;
