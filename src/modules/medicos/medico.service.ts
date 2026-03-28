/**
 * @file src/modules/medicos/medicoservice.ts
 * @description Capa de servicio para la logica de negocio de Medicos.
 */

import type {
    IRepository,
    ServiceResult
} from "../../lib/interfaces/repository.interface";
import type {
    Medico,
    MedicoConRelaciones,
    CreateMedicoDTO,
} from "./types";

export class MedicoService {
    constructor(
        private readonly repo: IRepository<MedicoConRelaciones, number, CreateMedicoDTO>
    ) { }

    async getAll(): Promise<ServiceResult<MedicoConRelaciones[]>> {
        try {
            const data = await this.repo.findAll();
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async getById(id: number): Promise<ServiceResult<MedicoConRelaciones>> {
        try {
            const data = await this.repo.findById(id);
            if (!data) {
                return {
                    data: null,
                    error: `Medico con ID ${id} no encontrado`,
                    success: false,
                };
            }
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async create(dto: CreateMedicoDTO): Promise<ServiceResult<MedicoConRelaciones>> {
        try {
            if (!this.validateEmail(dto.correoElectronico)) {
                return { data: null, error: "Correo electronico invalido", success: false };
            }
            if (!this.validatePhone(dto.telefono)) {
                return { data: null, error: "Telefono invalido", success: false };
            }
            const data = await this.repo.create(dto);
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async update(id: number, updates: Partial<CreateMedicoDTO>): Promise<ServiceResult<MedicoConRelaciones>> {
        try {
            const exists = await this.repo.findById(id);
            if (!exists) {
                return {
                    data: null,
                    error: `Medico ${id} no encontrado`,
                    success: false,
                };
            }

            if (updates.correoElectronico && !this.validateEmail(updates.correoElectronico)) {
                return { data: null, error: "Correo electronico invalido", success: false };
            }
            if (updates.telefono && !this.validatePhone(updates.telefono)) {
                return { data: null, error: "Telefono invalido", success: false };
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
            if (!deleted) {
                return {
                    data: false,
                    error: "No se pudo eliminar el medico",
                    success: false,
                };
            }
            return { data: true, error: null, success: true };
        } catch (err) {
            return { data: false, error: this.handleError(err), success: false };
        }
    }

    private validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private validatePhone(phone: string): boolean {
        return /^\d{7,10}$/.test(phone);
    }

    private handleError(err: unknown): string {
        if (err instanceof Error) return err.message;
        return "Error desconocido en MedicoService";
    }
}
