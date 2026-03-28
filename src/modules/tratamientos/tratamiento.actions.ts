/**
 * @file src/modules/tratamientos/tratamiento.actions.ts
 * @description Server Actions para operaciones de tratamientos.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TratamientoRepository } from "./tratamiento.repository";
import { TratamientoService } from "./tratamiento.service";
import {
  createTratamientoSchema,
  updateTratamientoSchema
} from "./tratamiento.schema";

const tratamientoRepo = new TratamientoRepository();
const tratamientoService = new TratamientoService(tratamientoRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createTratamientoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    visitaId: Number(formData.get("visitaId")),
    fechaInicio: formData.get("fechaInicio") as string,
    fechaFin: formData.get("fechaFin") as string,
  };

  const validation = createTratamientoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await tratamientoService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear tratamiento" };
  }

  revalidatePath("/dashboard/tratamientos");
  redirect("/dashboard/tratamientos");
}

export async function updateTratamientoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("tratamientoId"));
  const rawData = {
    tratamientoId: id,
    visitaId: Number(formData.get("visitaId")),
    fechaInicio: formData.get("fechaInicio") as string,
    fechaFin: formData.get("fechaFin") as string,
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateTratamientoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await tratamientoService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/tratamientos");
  revalidatePath(`/dashboard/tratamientos/${id}`);
  redirect("/dashboard/tratamientos");
}

export async function deleteTratamientoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("tratamientoId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await tratamientoService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/tratamientos");
  return { success: true, message: "Tratamiento eliminado exitosamente" };
}

export async function getTratamientoByIdAction(id: number) {
  return await tratamientoService.getById(id);
}

export async function getAllTratamientosAction() {
  return await tratamientoService.getAll();
}
