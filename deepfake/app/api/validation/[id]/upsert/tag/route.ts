import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/clients/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = decodeURIComponent(params.id);

  const packet = (await request.json()) as {
    type: string;
    count: number;
    times: number[];
  };

  await prisma.tag.upsert({
    where: {
      validationId_type: {
        validationId: id,
        type: packet.type,
      },
    },
    create: {
      type: packet.type,
      count: packet.count,
      times: packet.times,
      validation: {
        connect: { id },
      },
    },
    update: {
      count: packet.count,
      times: packet.times,
    },
  });

  return NextResponse.json({ id });
}
