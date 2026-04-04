import { NextResponse } from "next/server";
import { getLabels } from "@/data/db";

export async function GET() {
  return NextResponse.json({ labels: getLabels() });
}
