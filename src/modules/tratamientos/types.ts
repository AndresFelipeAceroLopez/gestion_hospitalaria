export interface Tratamiento {
  tratamientoId: string; // UUID
  visitaId: string;      // UUID
  fechaInicio: string;
  fechaFin: string;
}

export interface TratamientoConRelaciones extends Tratamiento {
  pacienteNombre: string;
  visitaFecha: string;
  visitaHora: string;
}

export type CreateTratamientoDTO = Omit<Tratamiento, "tratamientoId">;
export type UpdateTratamientoDTO = Partial<CreateTratamientoDTO>;

export interface TratamientoFilters {
  visitaId?: string;
  fechaInicio?: string;
}
