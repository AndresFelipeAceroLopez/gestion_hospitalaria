/**
 * @file src/modules/incapacidades/incapacidad.actions.ts
 * @description Server Actions para operaciones de incapacidades médicas.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IncapacidadRepository } from "./incapacidad.repository";
import { IncapacidadService } from "./incapacidad.service";
import {
  createIncapacidadSchema,
  updateIncapacidadSchema
} from "./incapacidad.schema";

const incapacidadRepo = new IncapacidadRepository();
const incapacidadService = new IncapacidadService(incapacidadRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createIncapacidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    fecha: formData.get("fecha") as string,
    tratamientoId: Number(formData.get("tratamientoId")),
  };

  const validation = createIncapacidadSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await incapacidadService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear incapacidad" };
  }

  revalidatePath("/dashboard/incapacidades");
  redirect("/dashboard/incapacidades");
}

export async function updateIncapacidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("incapacidadId"));
  const rawData = {
    incapacidadId: id,
    fecha: formData.get("fecha") as string,
    tratamientoId: Number(formData.get("tratamientoId")),
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateIncapacidadSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await incapacidadService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/incapacidades");
  revalidatePath(`/dashboard/incapacidades/${id}`);
  redirect("/dashboard/incapacidades");
}

export async function deleteIncapacidadAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("incapacidadId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await incapacidadService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/incapacidades");
  return { success: true, message: "Incapacidad eliminada exitosamente" };
}

export async function getIncapacidadByIdAction(id: number) {
  return await incapacidadService.getById(id);
}

export async function getAllIncapacidadesAction() {
  return await incapacidadService.getAll();
}
