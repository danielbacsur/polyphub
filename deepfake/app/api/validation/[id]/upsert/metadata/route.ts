import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/clients/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = decodeURIComponent(params.id);

  const packet = (await request.json()) as {
    length?: number;
    framerate?: number;
    duration?: number;
    blinks?: string;
    probability?: number;
  };

  await prisma.metadata.upsert({
    where: {
      validationId: id,
    },
    create: {
      length: packet.length,
      framerate: packet.framerate,
      duration: packet.duration,
      blinks: packet.blinks,
      probability: packet.probability,
      validation: {
        connect: { id },
      },
    },
    update: {
      ...packet,
    },
  });

  return NextResponse.json({ id });
}
