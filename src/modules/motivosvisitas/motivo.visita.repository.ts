/**
 * @file src/modules/motivosvisitas/motivo.visita.repository.ts
 * @description Repositorio extensivo para motivos de visita con analítica.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  MotivoVisita,
  CreateMotivoVisitaDTO,
  MotivoVisitaFilters
} from "./types";

export class MotivoVisitaRepository
implements
  IRepository<MotivoVisita, number, CreateMotivoVisitaDTO>,
  IPaginableRepository<MotivoVisita, MotivoVisitaFilters>
{
    async findById(id: number): Promise<MotivoVisita | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("motivosvisitas")
        .select("*")
        .eq("motivoid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: MotivoVisitaFilters): Promise<MotivoVisita[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("motivosvisitas").select("*").order("descripcion", { ascending: true });

      if (filters?.descripcion) query = query.ilike("descripcion", `%${filters.descripcion}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener motivos: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    /**
     * Consulta compleja: Motivos mas frecuentes.
     */
    async findMostFrequent(limit: number = 5): Promise<any[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("detallesvisitas")
            .select(`
                motivoid,
                motivosvisitas(descripcion),
                count:motivoid.count()
            `)
            .limit(limit);
        
        return data || [];
    }

    async create(dto: CreateMotivoVisitaDTO): Promise<MotivoVisita> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("motivosvisitas")
        .insert({
          descripcion: dto.descripcion,
        })
        .select()
        .single();

      if (error) throw new Error(`Error al crear motivo: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateMotivoVisitaDTO>): Promise<MotivoVisita | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("motivosvisitas")
        .update({
            descripcion: updates.descripcion,
        })
        .eq("motivoid", id)
        .select()
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("motivosvisitas").delete().eq("motivoid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: MotivoVisitaFilters): Promise<PageResult<MotivoVisita>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("motivosvisitas").select("*", { count: "exact" }).range(from, to).order("descripcion", { ascending: true });
      if (filters?.descripcion) query = query.ilike("descripcion", `%${filters.descripcion}%`);

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

    private mapToDomain(row: any): MotivoVisita {
      return {
        motivoId: Number(row.motivoid),
        descripcion: row.descripcion || "",
      };
    }
}
