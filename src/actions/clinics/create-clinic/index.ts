"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { clinicsTrable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinicAction = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const result = await db.insert(clinicsTrable).values({ name }).returning();
  if (!result) {
    throw new Error("Failed to create clinic");
  }
  const clinic = result[0];

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });
};
