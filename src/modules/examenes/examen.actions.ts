"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrdenExamenRepository } from "./examen.repository";
import { OrdenExamenService } from "./examen.service";
import {
  createOrdenExamenSchema,
  updateOrdenExamenSchema
} from "./examen.schema";

const examenRepo = new OrdenExamenRepository();
const examenService = new OrdenExamenService(examenRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createOrdenExamenAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const visitaIdRaw = formData.get("visitaId");
  const fechaRaw = formData.get("fecha");

  if (!visitaIdRaw || typeof visitaIdRaw !== "string") {
    return { success: false, message: "visitaId inválido" };
  }

  if (!fechaRaw || typeof fechaRaw !== "string") {
    return { success: false, message: "fecha inválida" };
  }

  const rawData = {
    visitaId: Number(visitaIdRaw),
    fecha: fechaRaw,
    visitaId: formData.get("visitaId"),
    fecha: formData.get("fecha"),
  };

  if (isNaN(rawData.visitaId)) {
    return { success: false, message: "visitaId inválido" };
  }

  const validation = createOrdenExamenSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await examenService.create(validation.data);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Error al crear orden de examen"
    };
  }

  revalidatePath("/dashboard/examenes");
  redirect("/dashboard/examenes");
}

export async function updateOrdenExamenAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const idRaw = formData.get("ordenExamenId");
  const visitaIdRaw = formData.get("visitaId");
  const fechaRaw = formData.get("fecha");

  // Validar ID
  if (!idRaw || typeof idRaw !== "string") {
    return { success: false, message: "ID inválido" };
  }

  const id = Number(idRaw);
  const id = String(formData.get("ordenExamenId") ?? "");
  const rawData = {
    ordenExamenId: id,
    visitaId: formData.get("visitaId"),
    fecha: formData.get("fecha"),
  };

  if (!id) {
    return { success: false, message: "ID inválido" };
  }

  // Validar otros campos
  if (!visitaIdRaw || typeof visitaIdRaw !== "string") {
    return { success: false, message: "visitaId inválido" };
  }

  if (!fechaRaw || typeof fechaRaw !== "string") {
    return { success: false, message: "fecha inválida" };
  }

  const rawData = {
    visitaId: Number(visitaIdRaw),
    fecha: fechaRaw,
  };

  if (isNaN(rawData.visitaId)) {
    return { success: false, message: "visitaId inválido" };
  }

  const validation = updateOrdenExamenSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await examenService.update(id, validation.data);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Error al actualizar"
    };
  }

  revalidatePath("/dashboard/examenes");
  revalidatePath(`/dashboard/examenes/${id}`);
  redirect("/dashboard/examenes");
}

export async function deleteOrdenExamenAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const idRaw = formData.get("ordenExamenId");

  if (!idRaw || typeof idRaw !== "string") {
    return { success: false, message: "ID inválido" };
  }

  const id = Number(idRaw);

  if (isNaN(id) || id <= 0) {
  const id = String(formData.get("ordenExamenId") ?? "");

  if (!id) {
    return { success: false, message: "ID inválido" };
  }

  const result = await examenService.delete(id as unknown as number);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Error al eliminar"
    };
  }

  revalidatePath("/dashboard/examenes");

  return {
    success: true,
    message: "Orden de examen eliminada exitosamente"
  };
}

export async function getOrdenExamenByIdAction(id: number) {
  return await examenService.getById(id);
}

export async function getAllOrdenExamenesAction() {
  return await examenService.getAll();
}