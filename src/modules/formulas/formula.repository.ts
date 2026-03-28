/**
 * @file src/modules/formulas/formula.repository.ts
 * @description Repositorio extensivo para formulas con relaciones profundas.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  FormulaConRelaciones,
  CreateFormulaDTO,
  FormulaFilters
} from "./types";
import type { TratamientoConRelaciones } from "../tratamientos/types";

const FORMULA_SELECT = `
  formulaid,
  tratamientoid,
  fecha,
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

export class FormulaRepository
implements
  IRepository<FormulaConRelaciones, number, CreateFormulaDTO>,
  IPaginableRepository<FormulaConRelaciones, FormulaFilters>
{
    async findById(id: number): Promise<FormulaConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("formulas")
        .select(FORMULA_SELECT)
        .eq("formulaid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: FormulaFilters): Promise<FormulaConRelaciones[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("formulas").select(FORMULA_SELECT).order("fecha", { ascending: false });

      if (filters?.tratamientoId) query = query.eq("tratamientoid", filters.tratamientoId);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener formulas: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    async create(dto: CreateFormulaDTO): Promise<FormulaConRelaciones> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("formulas")
        .insert({
          tratamientoid: dto.tratamientoId,
          fecha: dto.fecha,
        })
        .select(FORMULA_SELECT)
        .single();

      if (error) throw new Error(`Error al crear formula: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateFormulaDTO>): Promise<FormulaConRelaciones | null> {
      const supabase = await createServerSupabaseClient();
      
      const dbUpdates: any = {};
      if (updates.tratamientoId !== undefined) dbUpdates.tratamientoid = updates.tratamientoId;
      if (updates.fecha !== undefined) dbUpdates.fecha = updates.fecha;

      const { data, error } = await supabase
        .from("formulas")
        .update(dbUpdates)
        .eq("formulaid", id)
        .select(FORMULA_SELECT)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("formulas").delete().eq("formulaid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: FormulaFilters): Promise<PageResult<FormulaConRelaciones>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("formulas").select(FORMULA_SELECT, { count: "exact" }).range(from, to).order("fecha", { ascending: false });
      if (filters?.tratamientoId) query = query.eq("tratamientoid", filters.tratamientoId);

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

    private mapToDomain(row: any): FormulaConRelaciones {
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
        formulaId: Number(row.formulaid),
        tratamientoId: Number(row.tratamientoid),
        fecha: row.fecha || "",
        tratamiento
      };
    }
}