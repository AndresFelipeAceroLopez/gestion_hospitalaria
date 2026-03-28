/**
 * @file src/modules/pacientes/pacienteservice.ts
 * @description Capa de servicio para la logica de negocio de Pacientes.
 */

import type {
    IRepository,
    ServiceResult
} from "../../lib/interfaces/repository.interface";
import type {
    Paciente,
    CreatePacienteDTO,
} from "./types";

export class PacienteService {
    constructor(
        private readonly repo: IRepository<Paciente, number, CreatePacienteDTO>
    ) { }

    async getAll(): Promise<ServiceResult<Paciente[]>> {
        try {
            const data = await this.repo.findAll();
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async getById(id: number): Promise<ServiceResult<Paciente>> {
        try {
            const data = await this.repo.findById(id);
            if (!data) {
                return {
                    data: null,
                    error: `Paciente con ID ${id} no encontrado`,
                    success: false,
                };
            }
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async create(dto: CreatePacienteDTO): Promise<ServiceResult<Paciente>> {
        try {
            if (!this.validateEmail(dto.correoElectronico)) {
                return { data: null, error: "Correo electronico invalido", success: false };
            }
            if (!this.validatePhone(dto.telefono)) {
                return { data: null, error: "Telefono invalido (debe tener 10 digitos)", success: false };
            }
            const data = await this.repo.create(dto);
            return { data, error: null, success: true };
        } catch (err) {
            return { data: null, error: this.handleError(err), success: false };
        }
    }

    async update(id: number, updates: Partial<CreatePacienteDTO>): Promise<ServiceResult<Paciente>> {
        try {
            const exists = await this.repo.findById(id);
            if (!exists) {
                return {
                    data: null,
                    error: `Paciente ${id} no encontrado`,
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
                    error: "No se pudo eliminar el paciente",
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
        return "Error desconocido en PacienteService";
    }
}
