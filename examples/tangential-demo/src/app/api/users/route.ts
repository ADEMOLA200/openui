import { NextRequest, NextResponse } from "next/server";
import { getUsers, getUser } from "@/data/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const user = getUser(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  }

  return NextResponse.json({ users: getUsers() });
}
