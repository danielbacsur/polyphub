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
      metadata: {
        create: {},
      },
    },
  });
}

export async function submitValidation({ id, url }: Validation) {
  const finalizeCallback = `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/validation/${id}/finalize`;
  const upsertTagCallback = `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/validation/${id}/upsert/tag`;
  const upsertMetadataCallback = `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/validation/${id}/upsert/metadata`;

  const response = await fetch(
    `http://${process.env.VALIDATION_API_ADDRESS}/validate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        finalizeCallback,
        upsertTagCallback,
        upsertMetadataCallback
      }),
    }
  );

  return response.ok;
}
