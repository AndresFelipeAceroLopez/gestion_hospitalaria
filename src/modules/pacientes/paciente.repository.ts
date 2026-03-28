/**
 * @file src/modules/pacientes/paciente.repository.ts
 * @description Repositorio extensivo para pacientes con historial clínico y relaciones.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  Paciente,
  CreatePacienteDTO,
  PacienteFilters
} from "./types";

export class PacienteRepository
implements
  IRepository<Paciente, number, CreatePacienteDTO>,
  IPaginableRepository<Paciente, PacienteFilters>
{
    async findById(id: number): Promise<Paciente | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("pacienteid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: PacienteFilters): Promise<Paciente[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("pacientes").select("*").order("apellido", { ascending: true });

      if (filters?.nombre) query = query.ilike("nombre", `%${filters.nombre}%`);
      if (filters?.apellido) query = query.ilike("apellido", `%${filters.apellido}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener pacientes: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    /**
     * Consulta compleja: Historial de visitas del paciente con medicos.
     */
    async getVisitHistory(pacienteId: number): Promise<any[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("visitas")
            .select(`
                visitaid,
                fecha,
                hora,
                medicos!medicoid(nombre, apellido, especialidades!especialidadid(nombre))
            `)
            .eq("pacienteid", pacienteId)
            .order("fecha", { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }

    /**
     * Consulta compleja: Todos los tratamientos activos del paciente.
     */
    async getActiveTreatments(pacienteId: number): Promise<any[]> {
        const supabase = await createServerSupabaseClient();
        const now = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from("tratamientos")
            .select(`
                tratamientoid,
                fechainicio,
                fechafin,
                visitas!visitaid(visitaid, pacientes!pacienteid(*))
            `)
            .eq("visitas.pacienteid", pacienteId)
            .gte("fechafin", now);

        if (error) throw new Error(error.message);
        return data || [];
    }

    async create(dto: CreatePacienteDTO): Promise<Paciente> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("pacientes")
        .insert({
          nombre: dto.nombre,
          apellido: dto.apellido,
          fechanacimiento: dto.fechaNacimiento,
          sexo: dto.sexo,
          direccion: dto.direccion,
          telefono: dto.telefono,
          correoelectronico: dto.correoElectronico,
        })
        .select()
        .single();

      if (error) throw new Error(`Error al crear paciente: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreatePacienteDTO>): Promise<Paciente | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("pacientes")
        .update({
            nombre: updates.nombre,
            apellido: updates.apellido,
            fechanacimiento: updates.fechaNacimiento,
            sexo: updates.sexo,
            direccion: updates.direccion,
            telefono: updates.telefono,
            correoelectronico: updates.correoElectronico
        })
        .eq("pacienteid", id)
        .select()
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("pacientes").delete().eq("pacienteid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: PacienteFilters): Promise<PageResult<Paciente>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("pacientes").select("*", { count: "exact" }).range(from, to).order("apellido", { ascending: true });
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

    private mapToDomain(row: any): Paciente {
      return {
        pacienteId: Number(row.pacienteid),
        nombre: row.nombre || "",
        apellido: row.apellido || "",
        fechaNacimiento: row.fechanacimiento || "",
        sexo: row.sexo || "",
        direccion: row.direccion || "",
        telefono: row.telefono || "",
        correoElectronico: row.correoelectronico || "",
      };
    }
}
