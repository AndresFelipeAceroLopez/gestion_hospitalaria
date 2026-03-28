/**
 * @file src/modules/examenes/examenservice.ts
 */

import type {
    IRepository,
    ServiceResult
} from "../../lib/interfaces/repository.interface";
import type {
    OrdenExamen,
    OrdenExamenConRelaciones,
} from "./types";

export class OrdenExamenService {
    constructor(
        private readonly repo: IRepository<OrdenExamenConRelaciones, number, any>
    ) { }

    async getAll(): Promise<ServiceResult<OrdenExamenConRelaciones[]>> {
        try {
            const data = await this.repo.findAll();
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async getById(id: number): Promise<ServiceResult<OrdenExamenConRelaciones>> {
        try {
            const data = await this.repo.findById(id);
            if (!data) return { data: null, error: "No encontrado", success: false };
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async create(dto: any): Promise<ServiceResult<OrdenExamenConRelaciones>> {
        try {
            const data = await this.repo.create(dto);
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async update(id: number, updates: any): Promise<ServiceResult<OrdenExamenConRelaciones>> {
        try {
            const data = await this.repo.update(id, updates);
            if (!data) return { data: null, error: "No encontrado", success: false };
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
        return "Error en OrdenExamenService";
    }
}
