/**
 * @file src/modules/formulas/formula.actions.ts
 * @description Server Actions para operaciones de fórmulas médicas.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormulaRepository } from "./formula.repository";
import { FormulaService } from "./formula.service";
import {
  createFormulaSchema,
  updateFormulaSchema
} from "./formula.schema";

const formulaRepo = new FormulaRepository();
const formulaService = new FormulaService(formulaRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createFormulaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    tratamientoId: formData.get("tratamientoId"),
    fecha: formData.get("fecha"),
  };

  const validation = createFormulaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await formulaService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear fórmula" };
  }

  revalidatePath("/dashboard/formulas");
  redirect("/dashboard/formulas");
}

export async function updateFormulaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = String(formData.get("formulaId") ?? "");
  const rawData = {
    formulaId: id,
    tratamientoId: formData.get("tratamientoId"),
    fecha: formData.get("fecha"),
  };

  if (!id) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updateFormulaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await formulaService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/formulas");
  revalidatePath(`/dashboard/formulas/${id}`);
  redirect("/dashboard/formulas");
}

export async function deleteFormulaAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = String(formData.get("formulaId") ?? "");

  if (!id) {
    return { success: false, message: "ID inválido" };
  }

  const result = await formulaService.delete(id as unknown as number);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/formulas");
  return { success: true, message: "Fórmula eliminada exitosamente" };
}

export async function getFormulaByIdAction(id: number) {
  return await formulaService.getById(id);
}

export async function getAllFormulasAction() {
  return await formulaService.getAll();
}
