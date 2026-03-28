/**
 * @file src/modules/incapacidades/incapacidad.repository.ts
 * @description Repositorio extensivo para incapacidades con relaciones profundas.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  IncapacidadConRelaciones,
  CreateIncapacidadDTO,
  IncapacidadFilters
} from "./types";
import type { TratamientoConRelaciones } from "../tratamientos/types";

const INCAPACIDAD_SELECT = `
  incapacidadid,
  tratamientoid,
  fechainicio,
  fechafin,
  tratamientos!tratamientoid(
    tratamientoid,
    fechainicio,
    fechafin,
    visitaid,
    visitas!visitaid(
      visitaid,
      fecha,
      hora,
      pacientes!pacienteid(*),
      medicos!medicoid(*)
    )
  )
`;

export class IncapacidadRepository
implements
  IRepository<IncapacidadConRelaciones, number, CreateIncapacidadDTO>,
  IPaginableRepository<IncapacidadConRelaciones, IncapacidadFilters>
{
    async findById(id: number): Promise<IncapacidadConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("incapacidades")
        .select(INCAPACIDAD_SELECT)
        .eq("incapacidadid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: IncapacidadFilters): Promise<IncapacidadConRelaciones[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("incapacidades").select(INCAPACIDAD_SELECT).order("fechainicio", { ascending: false });

      if (filters?.tratamientoId) query = query.eq("tratamientoid", filters.tratamientoId);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener incapacidades: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    async create(dto: CreateIncapacidadDTO): Promise<IncapacidadConRelaciones> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("incapacidades")
        .insert({
          tratamientoid: dto.tratamientoId,
          fecha: dto.fecha,
          fechainicio: (dto as any).fechaInicio || dto.fecha,
          fechafin: (dto as any).fechaFin || dto.fecha
        } as any)
        .select(INCAPACIDAD_SELECT)
        .single();

      if (error) throw new Error(`Error al crear incapacidad: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateIncapacidadDTO>): Promise<IncapacidadConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      
      const dbUpdates: any = {};
      if (updates.tratamientoId !== undefined) dbUpdates.tratamientoid = updates.tratamientoId;
      if (updates.fecha) dbUpdates.fecha = updates.fecha;

      const { data, error } = await supabase
        .from("incapacidades")
        .update(dbUpdates)
        .eq("incapacidadid", id)
        .select(INCAPACIDAD_SELECT)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("incapacidades").delete().eq("incapacidadid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: IncapacidadFilters): Promise<PageResult<IncapacidadConRelaciones>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("incapacidades").select(INCAPACIDAD_SELECT, { count: "exact" }).range(from, to).order("fechainicio", { ascending: false });
      
      const { data, error, count } = await query;
      if (error) throw new Error(error.message);

      const totalRecords = count || 0;
      return {
        data: (data || []).map((row) => this.mapToDomain(row)),
        count: totalRecords,
        page,
        pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
      };
    }

    private mapToDomain(row: any): IncapacidadConRelaciones {
      const tr = row.tratamientos;
      const vi = tr?.visitas;

      const tratamiento: TratamientoConRelaciones = {
        tratamientoId: Number(tr?.tratamientoid),
        visitaId: Number(tr?.visitaid),
        fechaInicio: tr?.fechainicio || "",
        fechaFin: tr?.fechafin || "",
        visita: {
            visitaId: Number(vi?.visitaid),
            pacienteId: Number(vi?.pacienteid),
            medicoId: Number(vi?.medicoid),
            fecha: vi?.fecha || "",
            hora: vi?.hora || "",
        }
      };

      return {
        incapacidadId: Number(row.incapacidadid),
        fecha: row.fechainicio || row.fecha || "",
        tratamientoId: Number(row.tratamientoid),
        tratamiento
      };
    }
}
