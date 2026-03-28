/**
 * @file src/modules/pacientes/paciente.actions.ts
 * @description Server Actions para operaciones de pacientes.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PacienteRepository } from "./paciente.repository";
import { PacienteService } from "./paciente.service";
import {
  createPacienteSchema,
  updatePacienteSchema
} from "./paciente.schema";

const pacienteRepo = new PacienteRepository();
const pacienteService = new PacienteService(pacienteRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createPacienteAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    fechaNacimiento: formData.get("fechaNacimiento") as string,
    sexo: formData.get("sexo") as string,
    direccion: formData.get("direccion") as string,
    telefono: formData.get("telefono") as string,
    correoElectronico: formData.get("correoElectronico") as string,
  };

  const validation = createPacienteSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await pacienteService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al crear paciente" };
  }

  revalidatePath("/dashboard/pacientes");
  redirect("/dashboard/pacientes");
}

export async function updatePacienteAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("pacienteId"));
  const rawData = {
    pacienteId: id,
    nombre: formData.get("nombre") as string,
    apellido: formData.get("apellido") as string,
    fechaNacimiento: formData.get("fechaNacimiento") as string,
    sexo: formData.get("sexo") as string,
    direccion: formData.get("direccion") as string,
    telefono: formData.get("telefono") as string,
    correoElectronico: formData.get("correoElectronico") as string,
  };

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const validation = updatePacienteSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await pacienteService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error al actualizar" };
  }

  revalidatePath("/dashboard/pacientes");
  revalidatePath(`/dashboard/pacientes/${id}`);
  redirect("/dashboard/pacientes");
}

export async function deletePacienteAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("pacienteId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await pacienteService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/pacientes");
  return { success: true, message: "Paciente eliminado exitosamente" };
}

export async function getPacienteByIdAction(id: number) {
  return await pacienteService.getById(id);
}

export async function getAllPacientesAction() {
  return await pacienteService.getAll();
}
