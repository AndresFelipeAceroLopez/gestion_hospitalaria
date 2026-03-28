/**
 * @file src/modules/tratamientos/tratamientoservice.ts
 */

import type {
    IRepository,
    ServiceResult
} from "../../lib/interfaces/repository.interface";
import type {
    Tratamiento,
    TratamientoConRelaciones,
} from "./types";

export class TratamientoService {
    constructor(
        private readonly repo: IRepository<TratamientoConRelaciones, number, any>
    ) { }

    async getAll(): Promise<ServiceResult<TratamientoConRelaciones[]>> {
        try {
            const data = await this.repo.findAll();
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async getById(id: number): Promise<ServiceResult<TratamientoConRelaciones>> {
        try {
            const data = await this.repo.findById(id);
            if (!data) return { data: null, error: "No encontrado", success: false };
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async create(dto: any): Promise<ServiceResult<TratamientoConRelaciones>> {
        try {
            if (new Date(dto.fechaFin) < new Date(dto.fechaInicio)) {
                return { data: null, error: "La fecha de fin no puede ser anterior a la de inicio", success: false };
            }
            const data = await this.repo.create(dto);
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async update(id: number, updates: any): Promise<ServiceResult<TratamientoConRelaciones>> {
        try {
            const current = await this.repo.findById(id);
            if (!current) return { data: null, error: "No encontrado", success: false };

            const startDate = updates.fechaInicio || current.fechaInicio;
            const endDate = updates.fechaFin || current.fechaFin;

            if (new Date(endDate) < new Date(startDate)) {
                return { data: null, error: "La fecha de fin no puede ser anterior a la de inicio", success: false };
            }

            const data = await this.repo.update(id, updates);
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async delete(id: number): Promise<ServiceResult<boolean>> {
        try {
            const deleted = await this.repo.delete(id);
            return { data: deleted, error: null, success: true };
        } catch (err) {
            return { data: false, error: this.handleError(err), success: false };
        }
    }

    private handleError(err: unknown): string {
        if (err instanceof Error) return err.message;
        return "Error en TratamientoService";
    }
}
