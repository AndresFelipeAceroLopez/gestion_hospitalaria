/**
 * @file src/modules/especialidades/especialidad.actions.ts
 * @description Server Actions para operaciones de especialidades.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EspecialidadRepository } from "./especialidad.repository";
import { EspecialidadService } from "./especialidad.service";
import {
  createEspecialidadSchema,
  updateEspecialidadSchema
} from "./especialidad.schema";

const especialidadRepo = new EspecialidadRepository();
const especialidadService = new EspecialidadService(especialidadRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createEspecialidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre: formData.get("nombre") as string,
  };

  const validation = createEspecialidadSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await especialidadService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear especialidad" };
  }

  revalidatePath("/dashboard/especialidades");
  redirect("/dashboard/especialidades");
}

export async function updateEspecialidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("especialidadId"));
  const rawData = {
    especialidadId: id,
    nombre: formData.get("nombre") as string,
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateEspecialidadSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await especialidadService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/especialidades");
  revalidatePath(`/dashboard/especialidades/${id}`);
  redirect("/dashboard/especialidades");
}

export async function deleteEspecialidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("especialidadId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await especialidadService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/especialidades");
  return { success: true, message: "Especialidad eliminada exitosamente" };
}

export async function getEspecialidadByIdAction(id: number) {
  return await especialidadService.getById(id);
}

export async function getAllEspecialidadesAction() {
  return await especialidadService.getAll();
}
