"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { VisitaRepository } from "../../modules/visitas/visita.repository";

const CreateVisitaSchema = z.object({
  pacienteId: z.string().min(1, "Seleccione un paciente"),
  medicoId: z.string().min(1, "Seleccione un médico"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  // time inputs pueden enviar HH:MM o HH:MM:SS
  hora: z.string().regex(/^\d{2}:\d{2}/, "Hora inválida").transform((v) => v.slice(0, 5)),
  motivoConsulta: z.string().optional(),
  diagnostico: z.string().optional(),
  frecuenciaCardiaca: z.string().optional().transform((v) => (v && v !== "" ? Number(v) : undefined)),
  presionArterial: z.string().optional(),
  frecuenciaRespiratoria: z.string().optional().transform((v) => (v && v !== "" ? Number(v) : undefined)),
  temperatura: z.string().optional().transform((v) => (v && v !== "" ? Number(v) : undefined)),
  saturacionOxigeno: z.string().optional().transform((v) => (v && v !== "" ? Number(v) : undefined)),
});

export async function createVisitaAction(
  _prevState: unknown,
  formData: FormData
) {
  const rawData = Object.fromEntries(formData.entries());

  const validation = CreateVisitaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Errores en el formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const d = validation.data;

  try {
    const repo = new VisitaRepository();
    await repo.create({ pacienteId: d.pacienteId, medicoId: d.medicoId, fecha: d.fecha, hora: d.hora });
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Error al crear visita",
      errors: {} as Record<string, string[] | undefined>,
    };
  }

  revalidatePath("/dashboard/visitas");
  redirect("/dashboard/visitas");
}