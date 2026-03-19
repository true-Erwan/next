import { NextResponse } from "next/server";

export async function GET() {
  const secret = process.env.MON_TEXT_SECRET ?? "boom";
  return NextResponse.json({ secret });
}

