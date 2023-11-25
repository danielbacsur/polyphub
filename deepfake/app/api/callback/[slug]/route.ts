import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
  console.log("CALLBACKED", params.id);

  return new NextResponse("Hello world!")
}
