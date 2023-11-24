import { Validation, type User, Tag } from "@prisma/client";
import { getSession } from "@/lib/utils/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/clients/prisma";

export async function getUser(): Promise<User> {
  const session = await getSession();

  if (!session) notFound();

  return session.user;
}

export async function getValidations(id: string): Promise<Validation[]> {
  const validations = await prisma.validation.findMany({
    where: {
      user: {
        id,
      },
    },
  });
  return validations || notFound();
}

export async function getValidation(id: string): Promise<Validation> {
  const validation = await prisma.validation.findUnique({ where: { id } });
  return validation || notFound();
}

export async function getTags(id: string): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({
    where: { validation: { id } },
  });
  return tags || notFound();
}

export async function getTag(id: string): Promise<Tag> {
  const tag = await prisma.tag.findUnique({ where: { id } });
  return tag || notFound();
}
