"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MedicoRepository } from "./medico.repository";
import { MedicoService } from "./medico.service";
import {
  createMedicoSchema,
  updateMedicoSchema
} from "./medico.schema";

const medicoRepo = new MedicoRepository();
const medicoService = new MedicoService(medicoRepo);

type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const nombre = formData.get("nombre");
  const apellido = formData.get("apellido");
  const especialidadIdRaw = formData.get("especialidadId");
  const hospitalIdRaw = formData.get("hospitalId");
  const telefono = formData.get("telefono");
  const correoElectronico = formData.get("correoElectronico");

  if (
    typeof nombre !== "string" ||
    typeof apellido !== "string" ||
    typeof telefono !== "string" ||
    typeof correoElectronico !== "string" ||
    typeof especialidadIdRaw !== "string" ||
    typeof hospitalIdRaw !== "string"
  ) {
    return { success: false, message: "Datos inválidos" };
  }

  const rawData = {
    nombre,
    apellido,
    especialidadId: Number(especialidadIdRaw),
    hospitalId: Number(hospitalIdRaw),
    telefono,
    correoElectronico,
  };

  if (isNaN(rawData.especialidadId) || isNaN(rawData.hospitalId)) {
    return { success: false, message: "IDs inválidos" };
  }

  const validation = createMedicoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await medicoService.create(validation.data);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Error al crear médico"
    };
  }

  revalidatePath("/dashboard/medicos");
  redirect("/dashboard/medicos");
}

export async function updateMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const idRaw = formData.get("medicoId");

  if (!idRaw || typeof idRaw !== "string") {
    return { success: false, message: "ID inválido" };
  }

  const id = Number(idRaw);

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const nombre = formData.get("nombre");
  const apellido = formData.get("apellido");
  const especialidadIdRaw = formData.get("especialidadId");
  const hospitalIdRaw = formData.get("hospitalId");
  const telefono = formData.get("telefono");
  const correoElectronico = formData.get("correoElectronico");

  if (
    typeof nombre !== "string" ||
    typeof apellido !== "string" ||
    typeof telefono !== "string" ||
    typeof correoElectronico !== "string" ||
    typeof especialidadIdRaw !== "string" ||
    typeof hospitalIdRaw !== "string"
  ) {
    return { success: false, message: "Datos inválidos" };
  }

  const rawData = {
    nombre,
    apellido,
    especialidadId: Number(especialidadIdRaw),
    hospitalId: Number(hospitalIdRaw),
    telefono,
    correoElectronico,
  };

  if (isNaN(rawData.especialidadId) || isNaN(rawData.hospitalId)) {
    return { success: false, message: "IDs inválidos" };
  }

  const validation = updateMedicoSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores de validación",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await medicoService.update(id, validation.data);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Error al actualizar"
    };
  }

  revalidatePath("/dashboard/medicos");
  revalidatePath(`/dashboard/medicos/${id}`);
  redirect("/dashboard/medicos");
}

export async function deleteMedicoAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {

  const idRaw = formData.get("medicoId");

  if (!idRaw || typeof idRaw !== "string") {
    return { success: false, message: "ID inválido" };
  }

  const id = Number(idRaw);

  if (isNaN(id) || id <= 0) {
    return { success: false, message: "ID inválido" };
  }

  const result = await medicoService.delete(id);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Error al eliminar"
    };
  }

  revalidatePath("/dashboard/medicos");

  return {
    success: true,
    message: "Médico eliminado exitosamente"
  };
}

export async function getMedicoByIdAction(id: number) {
  return await medicoService.getById(id);
}

export async function getAllMedicosAction() {
  return await medicoService.getAll();
}