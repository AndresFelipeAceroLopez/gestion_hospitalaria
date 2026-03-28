/**
 * @file src/modules/medicos/medico.repository.ts
 *
 * @description Repositorio para Medicos con relaciones.
 * Implementa JOINs usando la sintaxis de Supabase PostgREST.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import type { 
  IRepository,
  IPaginableRepository,
  PageResult
} from "../../lib/interfaces/repository.interface";
import type {
  MedicoConRelaciones,
  CreateMedicoDTO,
  MedicoFilters
} from "./types";

/**
 * Query SELECT con JOINs de Supabase.
 * La sintaxis usa el nombre de la tabla referenciada seguido de !nombreFK
 * o directamente el nombre de la tabla si la FK es obvia.
 *
 * Equivale a este SQL:
 * SELECT m.*, e.nombre as esp_nombre, h.nombre as hosp_nombre
 * FROM medicos m
 * JOIN especialidades e ON m.especialidadid = e.especialidadid
 * JOIN hospitales h ON m.hospitalid = h.hospitalid
 */
const MEDICO_SELECT = `
  medicoid,
  nombre,
  apellido,
  especialidadid,
  hospitalid,
  telefono,
  correoelectronico,
  especialidades!especialidadid(especialidadid, nombre),
  hospitales!hospitalid(hospitalid, nombre, direccion, nit, telefono)
`;

export class MedicoRepository 
implements IRepository<MedicoConRelaciones, number, CreateMedicoDTO> 
{
  /**
   * Obtiene todos los medicos con sus relaciones.
   * El resultado incluye datos de Especialidad y Hospital.
   */
  async findAll(): Promise<MedicoConRelaciones[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .select(MEDICO_SELECT)
      .order("apellido", { ascending: true });

    if (error) throw new Error(`Error obteniendo medicos: ${error.message}`);

    return (data || []).map((row) => this.mapRow(row));
  }

  /**
   * Filtra medicos por especialidad.
   * Util para mostrar medicos disponibles de una especialidad.
   */
  async findByEspecialidad(especialidadId: number): Promise<MedicoConRelaciones[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .select(MEDICO_SELECT)
      .eq("especialidadid", especialidadId) // Filtro por especialidad
      .order("apellido");

    if (error) throw new Error(error.message);

    return (data || []).map((row) => this.mapRow(row));
  }

  async findById(id: number): Promise<MedicoConRelaciones | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .select(MEDICO_SELECT)
      .eq("medicoid", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // No rows returned
      throw new Error(`Error obteniendo medico: ${error.message}`);
    }

    return this.mapRow(data);
  }

  async create(dto: CreateMedicoDTO): Promise<MedicoConRelaciones> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("medicos")
      .insert({
        nombre: dto.nombre,
        apellido: dto.apellido,
        especialidadid: dto.especialidadId,
        hospitalid: dto.hospitalId,
        telefono: dto.telefono,
        correoelectronico: dto.correoElectronico,
      })
      .select(MEDICO_SELECT)
      .single();

    if (error) throw new Error(`Error creando medico: ${error.message}`);

    return this.mapRow(data);
  }

  async update(id: number, updates: Partial<CreateMedicoDTO>): Promise<MedicoConRelaciones> {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = {};
    if (updates.nombre !== undefined) updateData.nombre = updates.nombre;
    if (updates.apellido !== undefined) updateData.apellido = updates.apellido;
    if (updates.especialidadId !== undefined) updateData.especialidadid = updates.especialidadId;
    if (updates.hospitalId !== undefined) updateData.hospitalid = updates.hospitalId;
    if (updates.telefono !== undefined) updateData.telefono = updates.telefono;
    if (updates.correoElectronico !== undefined) updateData.correoelectronico = updates.correoElectronico;

    const { data, error } = await supabase
      .from("medicos")
      .update(updateData)
      .eq("medicoid", id)
      .select(MEDICO_SELECT)
      .single();

    if (error) throw new Error(`Error actualizando medico: ${error.message}`);

    return this.mapRow(data);
  }

  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("medicos")
      .delete()
      .eq("medicoid", id);

    if (error) throw new Error(`Error eliminando medico: ${error.message}`);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapRow(row: Record<string, any>): MedicoConRelaciones {
    return {
      medicoId: row.medicoid,
      nombre: row.nombre,
      apellido: row.apellido,
      especialidadId: row.especialidadid,
      hospitalId: row.hospitalid,
      telefono: row.telefono,
      correoElectronico: row.correoelectronico,
      especialidad: {
        especialidadId: row.especialidades?.especialidadid,
        nombre: row.especialidades?.nombre,
      },
      hospital: {
        hospitalId: row.hospitales?.hospitalid || 0,
        nombre: row.hospitales?.nombre || "",
        direccion: row.hospitales?.direccion || "",
        nit: row.hospitales?.nit || "",
        telefono: row.hospitales?.telefono || "",
      },
    };
  }
}