"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

export const deletePatients = actionClient
  .inputSchema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const pacient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });
    if (!pacient) {
      throw new Error("Paciente não encontrado");
    }
    if (!session.user.clinic?.id) {
      throw new Error("Clinic ID is required");
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));

    revalidatePath("/patients");
  });
