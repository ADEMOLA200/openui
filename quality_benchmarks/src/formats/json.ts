import { z } from "zod";

export function buildJsonSystemPrompt(schema: z.ZodType): string {
  const jsonSchema = z.toJSONSchema(schema);
  return `You are a data extraction assistant. Extract structured data from the provided document text.
Output ONLY valid JSON that conforms to this schema. No markdown, no code fences, no explanation.
Preserve the exact casing of names as they appear in the source document.

Schema:
${JSON.stringify(jsonSchema, null, 2)}`;
}

export function parseJsonOutput(
  output: string,
  schema: z.ZodType,
): {
  original: string;
  parsed: unknown | null;
  error: string | null;
  validationErrors: string[];
} {
  let parsed: unknown;
  try {
    // Strip markdown code fences if present (e.g. ```json\n...\n```)
    const stripped = output
      .trim()
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "");
    parsed = JSON.parse(stripped);
  } catch (e) {
    return {
      original: output,
      parsed: null,
      error: `JSON parse error: ${e instanceof Error ? e.message : String(e)}`,
      validationErrors: [],
    };
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    const validationErrors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`,
    );
    return {
      original: output,
      parsed,
      error: "Validation errors",
      validationErrors,
    };
  }

  return {
    parsed: result.data,
    original: output,
    error: null,
    validationErrors: [],
  };
}
