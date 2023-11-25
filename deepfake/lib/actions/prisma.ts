"use server";

import { type User, type Validation } from "@prisma/client";
import { prisma } from "@/lib/clients/prisma";

export async function createValidation(
  user: User,
  url: string
): Promise<Validation> {
  return await prisma.validation.create({
    data: {
      url,
      status: "pending",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
}
