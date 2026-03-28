/**
 * @file src/modules/pacientes/types.ts
 * @description Tipos de dominio para el modulo de Pacientes
 */

export interface Paciente {
  pacienteId: number; // <- pacienteid en la BD (Integer)
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // formato ISO: "YYYY-MM-DD"
  sexo: string;
  direccion: string;
  telefono: string;
  correoElectronico: string;
}

export type CreatePacienteDTO = Omit<Paciente, "pacienteId">;
export type UpdatePacienteDTO = Partial<CreatePacienteDTO>;

export interface PacienteFilters {
  nombre?: string;
  apellido?: string;
  sexo?: string;
}