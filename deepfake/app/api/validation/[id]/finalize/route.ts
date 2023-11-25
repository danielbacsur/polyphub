import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/clients/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = decodeURIComponent(params.id);

  const packet = (await request.json()) as {
    tags: { type: string; count: number; times: number[] }[];
    duration: number;
    blinks: string;
  };

  await prisma.validation.update({
    where: { id },
    data: {
      status: "complete",
      metadata: {
        create: {
          duration: packet.duration,
          blinks: packet.blinks,
        },
      },
      tags: {
        create: [
          ...packet.tags.map((tag) => ({
            type: tag.type,
            count: tag.count,
            times: tag.times,
          })),
        ],
      },
    },
  });

  return NextResponse.json({ id });
}
