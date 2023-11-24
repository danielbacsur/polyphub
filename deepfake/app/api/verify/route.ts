import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/clients/prisma";
import { getSession } from "@/lib/utils/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { url } = (await req.json()) as {
    url: string;
  };

  if (!url) {
    return new NextResponse("URL not found.", { status: 400 });
  }

  const { tags } = (await fetch(`${req.nextUrl.origin}/api/flask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
    }),
  }).then((res) => res.json())) as {
    tags: { timestamp: number; type: string }[];
  };

  const session = await getSession();

  if (session) {
    const validation = await prisma.$transaction(async (transaction) => {
      const validation = await transaction.validation.create({
        data: {
          video: url,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      for (const tag of tags) {
        await transaction.tag.create({
          data: {
            ...tag,
            validation: {
              connect: {
                id: validation.id,
              },
            },
          },
        });
      }

      return validation;
    });

    return NextResponse.json({ validation });
  }

  return NextResponse.json({ tags });
}
