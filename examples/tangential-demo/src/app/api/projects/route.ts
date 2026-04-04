import { NextRequest, NextResponse } from "next/server";
import { getProjects, getProject } from "@/data/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const project = getProject(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ project });
  }

  return NextResponse.json({ projects: getProjects() });
}
