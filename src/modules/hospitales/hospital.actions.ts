/**
 * @file src/modules/hospitales/hospital.actions.ts
 * @description Server Actions para operaciones de hospitales.
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HospitalRepository } from "./hospital.repository";
import { HospitalService } from "./hospital.service";
import {
  createHospitalSchema,
  updateHospitalSchema
} from "./hospital.schema";

// Instanciar con inyección de dependencias (DIP)
const hospitalRepo = new HospitalRepository();
const hospitalService = new HospitalService(hospitalRepo);

// Tipo para el estado del form (useActionState)
type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/**
 * Crea un nuevo hospital desde un formulario HTML.
 */
export async function createHospitalAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    nombre: formData.get("nombre") as string,
    direccion: formData.get("direccion") as string,
    nit: formData.get("nit") as string,
    telefono: formData.get("telefono") as string,
  };

  const validation = createHospitalSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrija los errores del formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await hospitalService.create(validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error desconocido" };
  }

  revalidatePath("/dashboard/hospitales");
  redirect("/dashboard/hospitales");
}

/**
 * Actualiza un hospital existente.
 */
export async function updateHospitalAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("hospitalId"));
  const rawData = {
    hospitalId: id,
    nombre: formData.get("nombre") as string,
    direccion: formData.get("direccion") as string,
    nit: formData.get("nit") as string,
    telefono: formData.get("telefono") as string,
  };

  if (isNaN(id) || id <= 0) {
    return {
      success: false,
      message: "ID inválido",
      errors: { hospitalId: ["El ID del hospital es inválido"] },
    };
  }

  const validation = updateHospitalSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrija los errores del formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const result = await hospitalService.update(id, validation.data);

  if (!result.success) {
    return { success: false, message: result.error || "Error desconocido" };
  }

  revalidatePath("/dashboard/hospitales");
  revalidatePath(`/dashboard/hospitales/${id}`);
  redirect("/dashboard/hospitales");
}

/**
 * Elimina un hospital por ID.
 */
export async function deleteHospitalAction(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get("hospitalId"));

  if (!id || isNaN(id)) {
    return { success: false, message: "ID inválido" };
  }

  const result = await hospitalService.delete(id);

  if (!result.success) {
    return { success: false, message: result.error || "Error al eliminar" };
  }

  revalidatePath("/dashboard/hospitales");
  return { success: true, message: "Hospital eliminado exitosamente" };
}

/**
 * Obtiene un hospital por ID (Server Component)
 */
export async function getHospitalByIdAction(id: number) {
  return await hospitalService.getById(id);
}

/**
 * Obtiene todos los hospitales (Server Component)
 */
export async function getAllHospitalesAction() {
  return await hospitalService.getAll();
}