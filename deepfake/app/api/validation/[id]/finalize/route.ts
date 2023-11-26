import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/clients/prisma";
import { track } from "@vercel/analytics";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = decodeURIComponent(params.id);

  const packet = (await request.json()) as {
    tags: { type: string; count: number; times: number[] }[];
    length: number;
    framerate: number;
    duration: number;
    blinks: string;
    probability: number;
  };

  await prisma.validation.update({
    where: { id },
    data: {
      status: "complete",
      metadata: {
        upsert: {
          where: { validationId: id },
          create: {
            length: packet.length,
            framerate: packet.framerate,
            duration: packet.duration,
            blinks: packet.blinks,
            probability: packet.probability,
          },
          update: {
            length: packet.length,
            framerate: packet.framerate,
            duration: packet.duration,
            blinks: packet.blinks,
            probability: packet.probability,
          },
        },
      },
      tags: {
        upsert: packet.tags.map((tag) => ({
          where: {
            validationId_type: {
              validationId: id,
              type: tag.type,
            },
          },
          create: {
            type: tag.type,
            count: tag.count,
            times: tag.times,
          },
          update: {
            count: tag.count,
            times: tag.times,
          },
        })),
      },
    },
  });

  track("validation-finalized");

  return NextResponse.json({ id });
}
