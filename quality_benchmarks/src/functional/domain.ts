import type { z } from "zod";
import type { Schema } from "@openuidev/lang/structured-outputs";

export interface Check {
  label: string;
  pass: boolean;
  actual?: unknown;
  expected?: unknown;
}

export interface VerificationResult {
  pass: boolean;
  checks: Check[];
}

export interface FunctionalTestCase {
  id: string;
  name: string;
  complexity: "medium" | "hard";
  prompt: string;        // Full problem description to give to the model
  schema: z.ZodType;
  langSchema?: Schema;
  verify: (parsed: unknown) => VerificationResult;
}

export interface FunctionalTestSuite {
  id: string;
  name: string;
  cases: FunctionalTestCase[];
}

export function chk(label: string, pass: boolean, actual?: unknown, expected?: unknown): Check {
  return { label, pass, actual, expected };
}
