/**
 * @file src/modules/hospitales/hospital.repository.ts
 * @description Repositorio extensivo para hospitales con consultas de capacidad y personal.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  Hospital,
  CreateHospitalDTO,
  HospitalFilters
} from "./types";

export class HospitalRepository
implements
  IRepository<Hospital, number, CreateHospitalDTO>,
  IPaginableRepository<Hospital, HospitalFilters>
{
    async findById(id: number): Promise<Hospital | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("hospitales")
        .select("*")
        .eq("hospitalid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: HospitalFilters): Promise<Hospital[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("hospitales").select("*").order("nombre", { ascending: true });

      if (filters?.nombre) query = query.ilike("nombre", `%${filters.nombre}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener hospitales: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    /**
     * Consulta compleja: Personal medico asignado al hospital.
     */
    async findMedicos(hospitalId: number): Promise<any[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("medicos")
            .select(`
                medicoid,
                nombre,
                apellido,
                especialidades!especialidadid(nombre)
            `)
            .eq("hospitalid", hospitalId);

        if (error) throw new Error(error.message);
        return data || [];
    }

    /**
     * Consulta compleja: Resumen de ocupacion/visitas por hospital.
     */
    async getStats(hospitalId: number): Promise<any> {
        const supabase = await createServerSupabaseClient();
        const { count: medicosCount } = await supabase
            .from("medicos")
            .select("*", { count: 'exact', head: true })
            .eq("hospitalid", hospitalId);
            
        // Podemos agregar mas stats aqui.
        return {
            medicosCount: medicosCount || 0
        };
    }

    async create(dto: CreateHospitalDTO): Promise<Hospital> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("hospitales")
        .insert({
          nombre: dto.nombre,
          direccion: dto.direccion,
          nit: dto.nit,
          telefono: dto.telefono,
        })
        .select()
        .single();

      if (error) throw new Error(`Error al crear hospital: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateHospitalDTO>): Promise<Hospital | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("hospitales")
        .update({
            nombre: updates.nombre,
            direccion: updates.direccion,
            nit: updates.nit,
            telefono: updates.telefono
        })
        .eq("hospitalid", id)
        .select()
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("hospitales").delete().eq("hospitalid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: HospitalFilters): Promise<PageResult<Hospital>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("hospitales").select("*", { count: "exact" }).range(from, to).order("nombre", { ascending: true });
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

    private mapToDomain(row: any): Hospital {
      return {
        hospitalId: row.hospitalid ?? 0,
        nombre: row.nombre || "",
        direccion: row.direccion || "",
        nit: row.nit || "",
        telefono: row.telefono || "",
      };
    }
}