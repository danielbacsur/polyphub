import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "video/mp4",
          "video/mpeg",
          "video/webm",
          "video/quicktime",
          "video/x-msvideo",
        ],
      }),
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 400 });
  }
}
