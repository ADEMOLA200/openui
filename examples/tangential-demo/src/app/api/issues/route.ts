import { NextRequest, NextResponse } from "next/server";
import { getIssues, getIssue, createIssue, updateIssue } from "@/data/db";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const id = params.get("id");

  if (id) {
    const issue = getIssue(id);
    if (!issue) return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    return NextResponse.json({ issue });
  }

  const issues = getIssues({
    teamId: params.get("teamId") ?? undefined,
    stateId: params.get("stateId") ?? undefined,
    assigneeId: params.get("assigneeId") ?? undefined,
    labelId: params.get("labelId") ?? undefined,
    projectId: params.get("projectId") ?? undefined,
    cycleId: params.get("cycleId") ?? undefined,
  });

  return NextResponse.json({ issues, totalCount: issues.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.title || !body.teamId) {
    return NextResponse.json({ error: "title and teamId are required" }, { status: 400 });
  }
  const issue = createIssue(body);
  return NextResponse.json({ success: true, issue }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, ...input } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const issue = updateIssue(id, input);
  if (!issue) return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  return NextResponse.json({ success: true, issue });
}
