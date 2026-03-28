/**
 * @file src/modules/medicamentos/medicamento.actions.ts
 * @description Server Actions para operaciones de medicamentos.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MedicamentoRepository } from "./medicamento.repository";
import { MedicamentoService } from "./medicamento.service";
import {
  createMedicamentoSchema,
  updateMedicamentoSchema
} from "./medicamento.schema";

const medicamentoRepo = new MedicamentoRepository();
const medicamentoService = new MedicamentoService(medicamentoRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createMedicamentoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre: formData.get("nombre") as string,
    descripcion: formData.get("descripcion") as string,
    cantidad: Number(formData.get("cantidad")),
    unidades: formData.get("unidades") as string,
    prescripcion: formData.get("prescripcion") as string,
  };

  const validation = createMedicamentoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await medicamentoService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear medicamento" };
  }

  revalidatePath("/dashboard/medicamentos");
  redirect("/dashboard/medicamentos");
}

export async function updateMedicamentoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("medicamentoId"));
  const rawData = {
    medicamentoId: id,
    nombre: formData.get("nombre") as string,
    descripcion: formData.get("descripcion") as string,
    cantidad: Number(formData.get("cantidad")),
    unidades: formData.get("unidades") as string,
    prescripcion: formData.get("prescripcion") as string,
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateMedicamentoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await medicamentoService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/medicamentos");
  revalidatePath(`/dashboard/medicamentos/${id}`);
  redirect("/dashboard/medicamentos");
}

export async function deleteMedicamentoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("medicamentoId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await medicamentoService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/medicamentos");
  return { success: true, message: "Medicamento eliminado exitosamente" };
}

export async function getMedicamentoByIdAction(id: number) {
  return await medicamentoService.getById(id);
}

export async function getAllMedicamentosAction() {
  return await medicamentoService.getAll();
}
