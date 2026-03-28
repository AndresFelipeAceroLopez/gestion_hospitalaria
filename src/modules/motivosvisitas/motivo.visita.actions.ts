/**
 * @file src/modules/motivosvisitas/motivo.visita.actions.ts
 * @description Server Actions para operaciones de motivos de visita.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MotivoVisitaRepository } from "./motivo.visita.repository";
import { MotivoVisitaService } from "./motivo.visita.service";
import {
  createMotivoVisitaSchema,
  updateMotivoVisitaSchema
} from "./motivo.visita.schema";

const motivoRepo = new MotivoVisitaRepository();
const motivoService = new MotivoVisitaService(motivoRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createMotivoVisitaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    descripcion: formData.get("descripcion") as string,
  };

  const validation = createMotivoVisitaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await motivoService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear motivo" };
  }

  revalidatePath("/dashboard/motivosvisitas");
  redirect("/dashboard/motivosvisitas");
}

export async function updateMotivoVisitaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("motivoId"));
  const rawData = {
    motivoId: id,
    descripcion: formData.get("descripcion") as string,
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateMotivoVisitaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await motivoService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/motivosvisitas");
  revalidatePath(`/dashboard/motivosvisitas/${id}`);
  redirect("/dashboard/motivosvisitas");
}

export async function deleteMotivoVisitaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("motivoId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await motivoService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/motivosvisitas");
  return { success: true, message: "Motivo eliminado exitosamente" };
}

export async function getMotivoVisitaByIdAction(id: number) {
  return await motivoService.getById(id);
}

export async function getAllMotivosVisitasAction() {
  return await motivoService.getAll();
}
