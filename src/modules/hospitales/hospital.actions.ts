"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HospitalRepository } from "./hospital.repository";
import { HospitalService } from "./hospital.service";
import {
  createHospitalSchema,
  updateHospitalSchema
} from "./hospital.schema";

// Instancias
const hospitalRepo = new HospitalRepository();
const hospitalService = new HospitalService(hospitalRepo);

/**
 * ✅ CREATE (CORREGIDO)
 */
export async function createHospitalAction(formData: FormData) {
  console.log("ACTION CREATE EJECUTADA"); // 👈 debug

  const rawData = {
    nombre: formData.get("nombre") as string,
    direccion: formData.get("direccion") as string,
    nit: formData.get("nit") as string,
    telefono: formData.get("telefono") as string,
  };

  const validation = createHospitalSchema.safeParse(rawData);

  if (!validation.success) {
    console.log("VALIDATION ERROR:", validation.error);
    return;
  }

  const result = await hospitalService.create(validation.data);

  if (!result.success) {
    console.log("SERVICE ERROR:", result.error);
    return;
  }

  console.log("HOSPITAL CREADO:", result.data);

  revalidatePath("/dashboard/hospitales");
  redirect("/dashboard/hospitales");
}

/**
 * ✅ UPDATE (CORREGIDO)
 */
export async function updateHospitalAction(formData: FormData) {
  const id = Number(formData.get("hospitalId"));

  if (!id || isNaN(id)) {
    console.log("ID inválido");
    return;
  }

  const rawData = {
    hospitalId: id,
    nombre: formData.get("nombre") as string,
    direccion: formData.get("direccion") as string,
    nit: formData.get("nit") as string,
    telefono: formData.get("telefono") as string,
  };

  const validation = updateHospitalSchema.safeParse(rawData);

  if (!validation.success) {
    console.log("VALIDATION ERROR:", validation.error);
    return;
  }

  const result = await hospitalService.update(id, validation.data);

  if (!result.success) {
    console.log("SERVICE ERROR:", result.error);
    return;
  }

  revalidatePath("/dashboard/hospitales");
  redirect("/dashboard/hospitales");
}

/**
 * ✅ DELETE (CORREGIDO)
 */
export async function deleteHospitalAction(formData: FormData) {
  const id = Number(formData.get("hospitalId"));

  if (!id || isNaN(id)) {
    console.log("ID inválido");
    return;
  }

  const result = await hospitalService.delete(id);

  if (!result.success) {
    console.log("ERROR DELETE:", result.error);
    return;
  }

  revalidatePath("/dashboard/hospitales");
}

/**
 * GET (sin cambios)
 */
export async function getHospitalByIdAction(id: number) {
  return await hospitalService.getById(id);
}

export async function getAllHospitalesAction() {
  return await hospitalService.getAll();
}