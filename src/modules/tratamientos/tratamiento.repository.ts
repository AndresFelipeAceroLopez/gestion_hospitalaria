/**
 * @file src/modules/tratamientos/tratamiento.repository.ts
 * @description Repositorio extensivo para tratamientos con relaciones profundas.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  TratamientoConRelaciones,
  CreateTratamientoDTO,
  TratamientoFilters
} from "./types";

const TRATAMIENTO_EXTENDED_SELECT = `
  tratamientoid,
  visitaid,
  fechainicio,
  fechafin,
  visitas!visitaid(
    visitaid,
    fecha,
    hora,
    pacientes!pacienteid(*),
    medicos!medicoid(*)
  )
`;

export class TratamientoRepository
implements
  IRepository<TratamientoConRelaciones, number, CreateTratamientoDTO>,
  IPaginableRepository<TratamientoConRelaciones, TratamientoFilters>
{
    async findById(id: number): Promise<TratamientoConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("tratamientos")
        .select(TRATAMIENTO_EXTENDED_SELECT)
        .eq("tratamientoid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: TratamientoFilters): Promise<TratamientoConRelaciones[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("tratamientos").select(TRATAMIENTO_EXTENDED_SELECT).order("fechainicio", { ascending: false });

      if (filters?.visitaId) query = query.eq("visitaid", filters.visitaId);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener tratamientos: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    async findByPaciente(pacienteId: number): Promise<TratamientoConRelaciones[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("tratamientos")
            .select(TRATAMIENTO_EXTENDED_SELECT)
            .eq("visitas.pacienteid", pacienteId)
            .order("fechainicio", { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []).map((row) => this.mapToDomain(row));
    }

    async create(dto: CreateTratamientoDTO): Promise<TratamientoConRelaciones> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("tratamientos")
        .insert({
          visitaid: dto.visitaId,
          fechainicio: dto.fechaInicio,
          fechafin: dto.fechaFin,
        })
        .select(TRATAMIENTO_EXTENDED_SELECT)
        .single();

      if (error) throw new Error(`Error al crear tratamiento: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateTratamientoDTO>): Promise<TratamientoConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      
      const dbUpdates: any = {};
      if (updates.visitaId !== undefined) dbUpdates.visitaid = updates.visitaId;
      if (updates.fechaInicio !== undefined) dbUpdates.fechainicio = updates.fechaInicio;
      if (updates.fechaFin !== undefined) dbUpdates.fechafin = updates.fechaFin;

      const { data, error } = await supabase
        .from("tratamientos")
        .update(dbUpdates)
        .eq("tratamientoid", id)
        .select(TRATAMIENTO_EXTENDED_SELECT)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("tratamientos").delete().eq("tratamientoid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: TratamientoFilters): Promise<PageResult<TratamientoConRelaciones>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("tratamientos").select(TRATAMIENTO_EXTENDED_SELECT, { count: "exact" }).range(from, to).order("fechainicio", { ascending: false });
      if (filters?.visitaId) query = query.eq("visitaid", filters.visitaId);

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

    private mapToDomain(row: any): TratamientoConRelaciones {
      const vi = row.visitas;
      return {
        tratamientoId: Number(row.tratamientoid),
        visitaId: Number(row.visitaid),
        fechaInicio: row.fechainicio || "",
        fechaFin: row.fechafin || "",
        visita: vi ? {
          visitaId: Number(vi.visitaid),
          pacienteId: Number(vi.pacienteid),
          medicoId: Number(vi.medicoid),
          fecha: vi.fecha || "",
          hora: vi.hora || "",
        } : undefined as any
      };
    }
}
