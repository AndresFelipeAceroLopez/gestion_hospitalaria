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

  const visitaIdRaw = formData.get("visitaId");
  const fechaInicio = formData.get("fechaInicio");
  const fechaFin = formData.get("fechaFin");

  if (
    typeof visitaIdRaw !== "string" ||
    typeof fechaInicio !== "string" ||
    typeof fechaFin !== "string"
  ) {
    return { success: false, message: "Datos inválidos" };
  }

  const rawData = {
    visitaId: Number(visitaIdRaw),
    fechaInicio,
    fechaFin,
  };

  if (isNaN(rawData.visitaId)) {
    return { success: false, message: "visitaId inválido" };
  }

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
    return {
      success: false,
      message: result.error || "Error al crear tratamiento"
    };
  }

  revalidatePath("/dashboard/tratamientos");
  redirect("/dashboard/tratamientos");
}

export async function updateTratamientoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const idRaw = formData.get("tratamientoId");
  const visitaIdRaw = formData.get("visitaId");
  const fechaInicio = formData.get("fechaInicio");
  const fechaFin = formData.get("fechaFin");

  // ✅ Validar ID
  if (!idRaw || typeof idRaw !== "string") {
    return { success: false, message: "ID inválido" };
  }

  const id = Number(idRaw);

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  // ✅ Validar campos
  if (
    typeof visitaIdRaw !== "string" ||
    typeof fechaInicio !== "string" ||
    typeof fechaFin !== "string"
  ) {
    return { success: false, message: "Datos inválidos" };
  }

  const rawData = {
    visitaId: Number(visitaIdRaw),
    fechaInicio,
    fechaFin,
  };

  if (isNaN(rawData.visitaId)) {
    return { success: false, message: "visitaId inválido" };
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
    return {
      success: false,
      message: result.error || "Error al actualizar"
    };
  }

  revalidatePath("/dashboard/tratamientos");
  revalidatePath(`/dashboard/tratamientos/${id}`);
  redirect("/dashboard/tratamientos");
}

export async function deleteTratamientoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const idRaw = formData.get("tratamientoId");

  if (!idRaw || typeof idRaw !== "string") {
    return { success: false, message: "ID inválido" };
  }

  const id = Number(idRaw);

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const result = await tratamientoService.delete(id);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Error al eliminar"
    };
  }

  revalidatePath("/dashboard/tratamientos");

  return {
    success: true,
    message: "Tratamiento eliminado exitosamente"
  };
}

export async function getTratamientoByIdAction(id: number) {
  return await tratamientoService.getById(id);
}

export async function getAllTratamientosAction() {
  return await tratamientoService.getAll();
}