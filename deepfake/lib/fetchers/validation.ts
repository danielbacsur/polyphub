"use server";

import { type Validation } from "@/lib/types/prisma";
import { prisma } from "@/lib/clients/prisma";
import { notFound } from "next/navigation";

export async function getValidations(id: string): Promise<Validation[]> {
  const validations = await prisma.validation.findMany({
    where: {
      user: {
        id,
      },
    },
    include: {
      tags: true,
      metadata: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return validations || notFound();
}

export async function getValidation(id: string): Promise<Validation> {
  const validation = await prisma.validation.findUnique({
    where: { id },
    include: {
      tags: true,
      metadata: true,
    },
  });
  return validation || notFound();
}
