import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/clients/prisma";
import { getSession } from "@/lib/utils/auth";
import { NewTags, NewValidation, RawValidation } from "@/lib/types/python";

if (!process.env.VALIDATION_API_ADDRESS) {
  throw new Error("VALIDATION_API_ADDRESS not found.");
}

export async function POST(req: NextRequest) {
  const { url, callback } = (await req.json()) as {
    url: string;
    callback: string;
  };

  if (!url) {
    return new NextResponse("URL not found.", { status: 400 });
  }

  if (!callback) {
    return new NextResponse("Callback not found.", { status: 400 });
  }

  console.log(url, callback);

  const res = await fetch(
    `http://${process.env.VALIDATION_API_ADDRESS}/validate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        callback,
      }),
    }
  ).then((res) => res.json());

  console.log(res);

  // const rawValidation = res[0] as RawValidation;

  // if (rawValidation.error) {
  //   return new NextResponse(rawValidation.error, { status: 400 });
  // }

  // const newValidation: NewValidation = {
  //   url,
  //   blinkInfo: rawValidation.blinks_info,
  //   frameCount: rawValidation.frame_count,
  //   frameRate: rawValidation.frame_rate,
  // };

  // const newTags: NewTags = rawValidation.tags.map((tag) => ({
  //   type: tag.type,
  //   count: tag.count,
  //   times: tag.times,
  // }));

  // const session = await getSession();

  // if (session) {
  //   const validation = await prisma.validation.create({
  //     data: {
  //       ...newValidation,
  //       user: {
  //         connect: {
  //           id: session.user.id,
  //         },
  //       },
  //     },
  //   });

  //   for (const tag of newTags) {
  //     await prisma.tag.create({
  //       data: {
  //         ...tag,
  //         validation: {
  //           connect: {
  //             id: validation.id,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   return NextResponse.json({ validation });
  // }

  // return NextResponse.json({ newValidation });
}
