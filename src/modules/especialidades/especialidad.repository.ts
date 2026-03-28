/**
 * @file src/modules/especialidades/especialidad.repository.ts
 * @description Repositorio extensivo para especialidades con analítica de personal.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  Especialidad,
  CreateEspecialidadDTO,
  EspecialidadFilters
} from "./types";

export class EspecialidadRepository
implements
  IRepository<Especialidad, number, CreateEspecialidadDTO>,
  IPaginableRepository<Especialidad, EspecialidadFilters>
{
    async findById(id: number): Promise<Especialidad | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("especialidades")
        .select("*")
        .eq("especialidadid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: EspecialidadFilters): Promise<Especialidad[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("especialidades").select("*").order("nombre", { ascending: true });

      if (filters?.nombre) query = query.ilike("nombre", `%${filters.nombre}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener especialidades: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    /**
     * Consulta compleja: Medicos por especialidad.
     */
    async findMedicos(especialidadId: number): Promise<any[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("medicos")
            .select(`
                medicoid,
                nombre,
                apellido,
                hospitales(nombre)
            `)
            .eq("especialidadid", especialidadId);

        if (error) throw new Error(error.message);
        return data || [];
    }

    async create(dto: CreateEspecialidadDTO): Promise<Especialidad> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("especialidades")
        .insert({
          nombre: dto.nombre,
        })
        .select()
        .single();

      if (error) throw new Error(`Error al crear especialidad: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateEspecialidadDTO>): Promise<Especialidad | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("especialidades")
        .update({
            nombre: updates.nombre,
        })
        .eq("especialidadid", id)
        .select()
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("especialidades").delete().eq("especialidadid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: EspecialidadFilters): Promise<PageResult<Especialidad>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("especialidades").select("*", { count: "exact" }).range(from, to).order("nombre", { ascending: true });
      if (filters?.nombre) query = query.ilike("nombre", `%${filters.nombre}%`);

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

    private mapToDomain(row: any): Especialidad {
      return {
        especialidadId: row.especialidadid ?? 0,
        nombre: row.nombre || "",
      };
    }
}
