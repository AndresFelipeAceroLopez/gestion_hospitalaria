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
          // pacienteid y medicoid son UUID en la DB (database.types.ts los declara como number pero está incorrecto)
          pacienteid: dto.pacienteId as unknown as number,
          medicoid: dto.medicoId as unknown as number,
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
      if (updates.pacienteId !== undefined) dbUpdates.pacienteid = updates.pacienteId as unknown as number;
      if (updates.medicoId !== undefined) dbUpdates.medicoid = updates.medicoId as unknown as number;
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
        visitaId: row.visitaid ?? 0,
        pacienteId: row.pacienteid ?? "",
        medicoId: row.medicoid ?? "",
        fecha: row.fecha || "",
        hora: row.hora || "",
        paciente: {
          pacienteId: row.pacientes?.pacienteid ?? 0,
          nombre: row.pacientes?.nombre || "",
          apellido: row.pacientes?.apellido || "",
          fechaNacimiento: row.pacientes?.fechanacimiento || "",
          sexo: row.pacientes?.sexo || "",
          direccion: row.pacientes?.direccion || "",
          telefono: row.pacientes?.telefono || "",
          correoElectronico: row.pacientes?.correoelectronico || "",
        },
        medico: {
          medicoId: row.medicos?.medicoid ?? 0,
          nombre: row.medicos?.nombre || "",
          apellido: row.medicos?.apellido || "",
          especialidadId: row.medicos?.especialidadid ?? 0,
          hospitalId: row.medicos?.hospitalid ?? 0,
          telefono: row.medicos?.telefono || "",
          correoElectronico: row.medicos?.correoelectronico || "",
        }
      };
    }
}