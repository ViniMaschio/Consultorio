"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertAppointmentsSchema } from "../upsertAppointmentsSchema";

export const upsertAppointments = actionClient
  .inputSchema(upsertAppointmentsSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinic?.id) {
      throw new Error("Clinic ID is required");
    }
    await db
      .insert(appointmentsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [appointmentsTable.id],
        set: { ...parsedInput },
      });
    revalidatePath("/appointments");
  });
