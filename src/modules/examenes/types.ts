export interface OrdenExamen {
  ordenExamenId: string; // UUID
  visitaId: string;      // UUID
  fecha: string;
}

export interface DetalleExamen {
  detalleExamenId: number;
  ordenExamenId: string;
  nombreExamen: string;
  tipoExamen: string;
  indicaciones: string;
}

export interface OrdenExamenConRelaciones extends OrdenExamen {
  pacienteNombre: string;
  visitaFecha: string;
  visitaHora: string;
  detalles?: DetalleExamen[];
}

export type CreateOrdenExamenDTO = Omit<OrdenExamen, "ordenExamenId">;
export type UpdateOrdenExamenDTO = Partial<CreateOrdenExamenDTO>;

export interface OrdenExamenFilters {
  fecha?: string;
  visitaId?: string;
}
