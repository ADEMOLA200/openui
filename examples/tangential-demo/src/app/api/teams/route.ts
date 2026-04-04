import { NextRequest, NextResponse } from "next/server";
import { getTeams, getTeam } from "@/data/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const team = getTeam(id);
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json({ team });
  }

  return NextResponse.json({ teams: getTeams() });
}
