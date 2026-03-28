/**
 * @file src/modules/examenes/examen.repository.ts
 * @description Repositorio extensivo para examenes con relaciones profundas.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  OrdenExamenConRelaciones,
  CreateOrdenExamenDTO,
  OrdenExamenFilters
} from "./types";

const ORDEN_EXAMEN_EXTENDED_SELECT = `
  ordenexamenid,
  visitaid,
  fecha,
  visitas!visitaid(
    visitaid,
    fecha,
    hora,
    pacientes!pacienteid(*),
    medicos!medicoid(*)
  )
`;

export class OrdenExamenRepository
implements
  IRepository<OrdenExamenConRelaciones, number, CreateOrdenExamenDTO>,
  IPaginableRepository<OrdenExamenConRelaciones, OrdenExamenFilters>
{
    async findById(id: number): Promise<OrdenExamenConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("orden_examenes")
        .select(ORDEN_EXAMEN_EXTENDED_SELECT)
        .eq("ordenexamenid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: OrdenExamenFilters): Promise<OrdenExamenConRelaciones[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("orden_examenes").select(ORDEN_EXAMEN_EXTENDED_SELECT).order("fecha", { ascending: false });

      if (filters?.visitaId) query = query.eq("visitaid", filters.visitaId);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener examenes: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    async findByPaciente(pacienteId: number): Promise<OrdenExamenConRelaciones[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("orden_examenes")
            .select(ORDEN_EXAMEN_EXTENDED_SELECT)
            .eq("visitas.pacienteid", pacienteId)
            .order("fecha", { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []).map((row) => this.mapToDomain(row));
    }

    async create(dto: CreateOrdenExamenDTO): Promise<OrdenExamenConRelaciones> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("orden_examenes")
        .insert({
          visitaid: dto.visitaId,
          fecha: dto.fecha,
        })
        .select(ORDEN_EXAMEN_EXTENDED_SELECT)
        .single();

      if (error) throw new Error(`Error al crear orden examen: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateOrdenExamenDTO>): Promise<OrdenExamenConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      
      const dbUpdates: any = {};
      if (updates.visitaId !== undefined) dbUpdates.visitaid = updates.visitaId;
      if (updates.fecha !== undefined) dbUpdates.fecha = updates.fecha;

      const { data, error } = await supabase
        .from("orden_examenes")
        .update(dbUpdates)
        .eq("ordenexamenid", id)
        .select(ORDEN_EXAMEN_EXTENDED_SELECT)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("orden_examenes").delete().eq("ordenexamenid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: OrdenExamenFilters): Promise<PageResult<OrdenExamenConRelaciones>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("orden_examenes").select(ORDEN_EXAMEN_EXTENDED_SELECT, { count: "exact" }).range(from, to).order("fecha", { ascending: false });
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

    private mapToDomain(row: any): OrdenExamenConRelaciones {
      const vi = row.visitas;
      return {
        ordenExamenId: Number(row.ordenexamenid),
        visitaId: Number(row.visitaid),
        fecha: row.fecha || "",
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
