/**
 * @file src/modules/visitas/visita.repository.ts
 * @description Repositorio para la tabla "visitas" de Supabase con relaciones.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  VisitaConRelaciones,
  CreateVisitaDTO,
  VisitaFilters
} from "./types";

const VISITA_SELECT = `
  visitaid,
  pacienteid,
  medicoid,
  fecha,
  hora,
  pacientes!pacienteid(
    pacienteid, 
    nombre, 
    apellido, 
    fechanacimiento, 
    sexo, 
    direccion, 
    telefono, 
    correoelectronico
  ),
  medicos!medicoid(
    medicoid, 
    nombre, 
    apellido, 
    especialidadid, 
    hospitalid, 
    telefono, 
    correoelectronico
  )
`;

export class VisitaRepository
implements
  IRepository<VisitaConRelaciones, number, CreateVisitaDTO>,
  IPaginableRepository<VisitaConRelaciones, VisitaFilters>
{
    async findById(id: number): Promise<VisitaConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("visitas")
        .select(VISITA_SELECT)
        .eq("visitaid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: VisitaFilters): Promise<VisitaConRelaciones[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("visitas").select(VISITA_SELECT).order("fecha", { ascending: false });

      if (filters?.pacienteId) query = query.eq("pacienteid", filters.pacienteId);
      if (filters?.medicoId) query = query.eq("medicoid", filters.medicoId);
      if (filters?.fecha) query = query.eq("fecha", filters.fecha);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener visitas: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    async create(dto: CreateVisitaDTO): Promise<VisitaConRelaciones> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("visitas")
        .insert({
          pacienteid: dto.pacienteId,
          medicoid: dto.medicoId,
          fecha: dto.fecha,
          hora: dto.hora,
        })
        .select(VISITA_SELECT)
        .single();

      if (error) throw new Error(`Error al crear visita: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateVisitaDTO>): Promise<VisitaConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      
      const dbUpdates: any = {};
      if (updates.pacienteId !== undefined) dbUpdates.pacienteid = updates.pacienteId;
      if (updates.medicoId !== undefined) dbUpdates.medicoid = updates.medicoId;
      if (updates.fecha !== undefined) dbUpdates.fecha = updates.fecha;
      if (updates.hora !== undefined) dbUpdates.hora = updates.hora;

      const { data, error } = await supabase
        .from("visitas")
        .update(dbUpdates)
        .eq("visitaid", id)
        .select(VISITA_SELECT)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("visitas").delete().eq("visitaid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: VisitaFilters): Promise<PageResult<VisitaConRelaciones>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("visitas").select(VISITA_SELECT, { count: "exact" }).range(from, to).order("fecha", { ascending: false });
      
      if (filters?.pacienteId) query = query.eq("pacienteid", filters.pacienteId);
      if (filters?.medicoId) query = query.eq("medicoid", filters.medicoId);

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

    private mapToDomain(row: any): VisitaConRelaciones {
      return {
        visitaId: Number(row.visitaid),
        pacienteId: Number(row.pacienteid),
        medicoId: Number(row.medicoid),
        fecha: row.fecha || "",
        hora: row.hora || "",
        paciente: {
          pacienteId: Number(row.pacientes?.pacienteid),
          nombre: row.pacientes?.nombre || "",
          apellido: row.pacientes?.apellido || "",
          fechaNacimiento: row.pacientes?.fechanacimiento || "",
          sexo: row.pacientes?.sexo || "",
          direccion: row.pacientes?.direccion || "",
          telefono: row.pacientes?.telefono || "",
          correoElectronico: row.pacientes?.correoelectronico || "",
        },
        medico: {
          medicoId: Number(row.medicos?.medicoid),
          nombre: row.medicos?.nombre || "",
          apellido: row.medicos?.apellido || "",
          especialidadId: Number(row.medicos?.especialidadid),
          hospitalId: Number(row.medicos?.hospitalid),
          telefono: row.medicos?.telefono || "",
          correoElectronico: row.medicos?.correoelectronico || "",
        }
      };
    }
}