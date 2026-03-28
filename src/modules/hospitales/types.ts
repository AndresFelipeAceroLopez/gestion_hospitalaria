/**
 * @file src/modules/hospitales/types.ts
 * @description Tipos de dominio para el modulo de Hospitales
 */

export interface Hospital {
  hospitalId: number; // <- hospitalid en la BD (Integer)
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
}

export type CreateHospitalDTO = Omit<Hospital, "hospitalId">;
export type UpdateHospitalDTO = Partial<CreateHospitalDTO>;

export interface HospitalFilters {
  nombre?: string;
}