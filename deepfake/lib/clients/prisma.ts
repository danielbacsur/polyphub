import { PrismaClient } from "@prisma/client";

if (!process.env.POSTGRES_PRISMA_URL) {
  throw new Error("POSTGRES_PRISMA_URL not found.");
}

if (!process.env.POSTGRES_URL_NON_POOLING) {
  throw new Error("POSTGRES_URL_NON_POOLING not found.");
}

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}