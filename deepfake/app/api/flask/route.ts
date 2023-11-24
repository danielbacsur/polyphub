import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { url } = (await req.json()) as {
    url: string;
  };

  if (!url) {
    return new NextResponse("URL not found.", { status: 400 });
  }

  const tags = [
    { timestamp: 1, type: "blur" },
    { timestamp: 1, type: "lipsync" },
    { timestamp: 1, type: "noise" },
  ];

  return NextResponse.json({ tags });
}
