/**
 * @file src/modules/visitas/visita.actions.ts
 * @description Server Actions para operaciones de visitas.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { VisitaRepository } from "./visita.repository";
import { VisitaService } from "./visita.service";
import {
  createVisitaSchema,
  updateVisitaSchema
} from "./visita.schema";

const visitaRepo = new VisitaRepository();
const visitaService = new VisitaService(visitaRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createVisitaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    pacienteId: Number(formData.get("pacienteId")),
    medicoId: Number(formData.get("medicoId")),
    fecha: formData.get("fecha") as string,
    hora: formData.get("hora") as string,
  };

  const validation = createVisitaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await visitaService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear visita" };
  }

  revalidatePath("/dashboard/visitas");
  redirect("/dashboard/visitas");
}

export async function updateVisitaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("visitaId"));
  const rawData = {
    visitaId: id,
    pacienteId: Number(formData.get("pacienteId")),
    medicoId: Number(formData.get("medicoId")),
    fecha: formData.get("fecha") as string,
    hora: formData.get("hora") as string,
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateVisitaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await visitaService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/visitas");
  revalidatePath(`/dashboard/visitas/${id}`);
  redirect("/dashboard/visitas");
}

export async function deleteVisitaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("visitaId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await visitaService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/visitas");
  return { success: true, message: "Visita eliminada exitosamente" };
}

export async function getVisitaByIdAction(id: number) {
  return await visitaService.getById(id);
}

export async function getAllVisitasAction() {
  return await visitaService.getAll();
}
