import { type User } from "@prisma/client";
import { getSession } from "@/lib/utils/auth";
import { notFound } from "next/navigation";

export async function getUser(): Promise<User> {
  const session = await getSession();

  if (!session) notFound();

  return session.user;
}
