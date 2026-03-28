/**
 * @file src/modules/medicos/types.ts
 * @description Tipos de dominio para el modulo de Medicos.
 */

import type { Especialidad } from "../especialidades/types";
import type { Hospital } from "../hospitales/types";

export interface Medico {
  medicoId: number; // <- medicoid en la BD (Integer)
  nombre: string;
  apellido: string;
  especialidadId: number; // <- especialidadid en la BD (Integer)
  hospitalId: number; // <- hospitalid en la BD (Integer)
  telefono: string;
  correoElectronico: string;
}

/** Medico con datos relacionados (JOIN) */
export interface MedicoConRelaciones extends Medico {
  especialidad: Especialidad;
  hospital: Hospital;
}

export type CreateMedicoDTO = Omit<Medico, "medicoId">;
export type UpdateMedicoDTO = Partial<CreateMedicoDTO>;

export interface MedicoFilters {
  nombre?: string;
  apellido?: string;
  especialidadId?: number;
  hospitalId?: number;
}