/**
 * @file src/modules/medicos/medico.actions.ts
 * @description Server Actions para operaciones de medicos.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MedicoRepository } from "./medico.repository";
import { MedicoService } from "./medico.service";
import {
  createMedicoSchema,
  updateMedicoSchema
} from "./medico.schema";

const medicoRepo = new MedicoRepository();
const medicoService = new MedicoService(medicoRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    especialidadId: Number(formData.get("especialidadId")),
    hospitalId: Number(formData.get("hospitalId")),
    telefono: formData.get("telefono") as string,
    correoElectronico: formData.get("correoElectronico") as string,
  };

  const validation = createMedicoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await medicoService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear médico" };
  }

  revalidatePath("/dashboard/medicos");
  redirect("/dashboard/medicos");
}

export async function updateMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("medicoId"));
  const rawData = {
    medicoId: id,
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    especialidadId: Number(formData.get("especialidadId")),
    hospitalId: Number(formData.get("hospitalId")),
    telefono: formData.get("telefono") as string,
    correoElectronico: formData.get("correoElectronico") as string,
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateMedicoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await medicoService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/medicos");
  revalidatePath(`/dashboard/medicos/${id}`);
  redirect("/dashboard/medicos");
}

export async function deleteMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("medicoId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await medicoService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/medicos");
  return { success: true, message: "Médico eliminado exitosamente" };
}

export async function getMedicoByIdAction(id: number) {
  return await medicoService.getById(id);
}

export async function getAllMedicosAction() {
  return await medicoService.getAll();
}
