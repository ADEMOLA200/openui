import { NextRequest, NextResponse } from "next/server";
import { getCycles } from "@/data/db";

export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get("teamId") ?? undefined;
  return NextResponse.json({ cycles: getCycles(teamId) });
}
