/**
 * @file src/modules/visitas/types.ts
 * @description Tipos para el modulo de Visitas (el mas complejo del sistema)
 */

export interface Visita {
  visitald: number;
  pacienteld: number;
  medicold: number;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:MM"
}

export interface DetalleVisita {
  detalleVisitId: number;
  visitId: number;
  motiVolId: number;
  diagnostico: string;
}

export interface SignoVital {
  signoVitalId: number;
  visitId: number;
  frecuenciaCardiaca: number;
  presionArterial: string; // Ej: "120/80"
  frecuenciaRespiratoria: number;
  temperatura: number;
  saturacionOxigeno: number;
}

/** Visita completa con todos sus datos relacionados */
export interface VisitaComplete extends Visita {
  paciente: { nombre: string; apellido: string; telefono: string };
  medico: { nombre: string; apellido: string; especialidad: string };
  detalle?: DetalleVisita & { motivoDescripcion: string };
  signosVitales?: Omit<SignoVital, "signoVitalId" | "visitId">;
}

/** DTO para registrar una nueva visita completa */
export interface CreateVisitaCompleteDTO {
  pacientId: number;
  medicId: number;
  fecha: string;
  hora: string;
  // Datos adicionales de la visita (opcionales al crear)
  motiVolId: number;
  diagnostico: string;
  signosVitales?: {
    frecuenciaCardiaca: number;
  }[];
}