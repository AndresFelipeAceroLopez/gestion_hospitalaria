/**
 * @file src/modules/medicamentos/medicamento.repository.ts
 * @description Repositorio extensivo para medicamentos con consultas de stock y uso real.
 */

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { IRepository, IPaginableRepository, PageResult } from "../../lib/interfaces/repository.interface";
import type {
  Medicamento,
  CreateMedicamentoDTO,
  MedicamentoFilters
} from "./types";

export class MedicamentoRepository
implements
  IRepository<Medicamento, number, CreateMedicamentoDTO>,
  IPaginableRepository<Medicamento, MedicamentoFilters>
{
    async findById(id: number): Promise<Medicamento | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("medicamentos")
        .select("*")
        .eq("medicamentoid", id)
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async findAll(filters?: MedicamentoFilters): Promise<Medicamento[]> {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from("medicamentos").select("*").order("nombre", { ascending: true });

      if (filters?.nombre) query = query.ilike("nombre", `%${filters.nombre}%`);

      const { data, error } = await query;
      if (error) throw new Error(`Error al obtener medicamentos: ${error.message}`);
      return (data || []).map((row) => this.mapToDomain(row));
    }

    /**
     * Consulta compleja: Medicamentos con bajo stock (cantidad < threshold).
     */
    async findLowStock(threshold: number = 10): Promise<Medicamento[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("medicamentos")
            .select("*")
            .lt("cantidad", threshold)
            .order("cantidad", { ascending: true });

        if (error) throw new Error(error.message);
        return (data || []).map((row) => this.mapToDomain(row));
    }

    /**
     * Consulta compleja: Medicamentos mas recetados.
     * Usa la tabla de union 'detallesformulas'.
     */
    async findMostPrescribed(limit: number = 5): Promise<any[]> {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("detallesformulas")
            .select(`
                medicamentoid,
                medicamentos(nombre),
                count:medicamentoid.count()
            `)
            .limit(limit);
        
        return data || [];
    }

    async create(dto: CreateMedicamentoDTO): Promise<Medicamento> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from("medicamentos")
        .insert({
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          cantidad: dto.cantidad,
          prescripcion: dto.prescripcion,
          unidades: dto.unidades
        })
        .select()
        .single();

      if (error) throw new Error(`Error al crear medicamento: ${error.message}`);
      return this.mapToDomain(data);
    }

    async update(id: number, updates: Partial<CreateMedicamentoDTO>): Promise<Medicamento | null> {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("medicamentos")
        .update({
            nombre: updates.nombre,
            descripcion: updates.descripcion,
            cantidad: updates.cantidad,
            prescripcion: updates.prescripcion,
            unidades: updates.unidades
        })
        .eq("medicamentoid", id)
        .select()
        .single();

      if (error || !data) return null;
      return this.mapToDomain(data);
    }

    async delete(id: number): Promise<boolean> {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("medicamentos").delete().eq("medicamentoid", id);
      return !error;
    }

    async findPaginated(page: number, pageSize: number, filters?: MedicamentoFilters): Promise<PageResult<Medicamento>> {
      const supabase = await createServerSupabaseClient();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase.from("medicamentos").select("*", { count: "exact" }).range(from, to).order("nombre", { ascending: true });
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

    private mapToDomain(row: any): Medicamento {
      return {
        medicamentoId: Number(row.medicamentoid),
        nombre: row.nombre || "",
        descripcion: row.descripcion || "",
        cantidad: Number(row.cantidad || 0),
        prescripcion: row.prescripcion || "",
        unidades: row.unidades || ""
      };
    }
}
