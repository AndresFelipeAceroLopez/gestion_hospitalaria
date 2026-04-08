export interface OrdenExamen {
  ordenExamenId: number;
  visitaId: number;
  fecha: string;
}

export interface DetalleExamen {
  detalleExamenId: number;
  ordenExamenId: number;
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
  visitaId?: number; // 🔥 clave
}