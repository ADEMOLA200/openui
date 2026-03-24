import { z } from "zod";
import type { DefinedComponent, Library, PromptOptions } from "../library";
import { isReactiveSchema } from "../runtime/reactive";
import { BUILTINS } from "./builtins";

const PREAMBLE = `You are an AI assistant that responds using openui-lang, a declarative UI language. Your ENTIRE response must be valid openui-lang code — no markdown, no explanations, just openui-lang.`;

function syntaxRules(rootName: string, hasBindings: boolean): string {
  const lines = [
    "## Syntax Rules",
    "",
    "1. Each statement is on its own line: `identifier = Expression`",
    `2. \`root\` is the entry point — every program must define \`root = ${rootName}(...)\``,
    '3. Expressions are: strings ("..."), numbers, booleans (true/false), null, arrays ([...]), objects ({...}), or component calls TypeName(arg1, arg2, ...)',
    "4. Use references for readability: define `name = ...` on one line, then use `name` later",
    "5. EVERY variable (except root) MUST be referenced by at least one other variable. Unreferenced variables are silently dropped and will NOT render. Always include defined variables in their parent's children/items array.",
    "6. Arguments are POSITIONAL (order matters, not names)",
    "7. Optional arguments can be omitted from the end",
  ];

  if (hasBindings) {
    lines.push(
      "8. Declare mutable state with `$varName = defaultValue`. Components marked with `$binding` can read/write these. Undeclared $variables are auto-created with null default.",
      '9. String concatenation: `"text" + $var + "more"`',
      "10. Dot member access: `query.field` reads a field; on arrays it extracts that field from every element",
      "11. Index access: `arr[0]`, `data[index]`",
      "12. Arithmetic operators: +, -, *, /, % (work on numbers; + is string concat when either side is a string)",
      "13. Comparison: ==, !=, >, <, >=, <=",
      "14. Logical: &&, ||, ! (prefix)",
      "15. Ternary: `condition ? valueIfTrue : valueIfFalse`",
      "16. Parentheses for grouping: `(a + b) * c`",
    );
  } else {
    lines.push("8. No operators, no logic, no variables — only declarations");
  }

  lines.push("- Strings use double quotes with backslash escaping");
  if (hasBindings) {
    lines.push(
      "- $variables store simple values (strings or numbers). Arithmetic on $variables does string concat. Use arithmetic on query result fields for math.",
    );
  }

  return lines.join("\n");
}

function builtinFunctionsSection(): string {
  // Auto-generated from shared builtin registry — single source of truth
  const lines = Object.values(BUILTINS)
    .map((b) => `${b.signature} — ${b.description}`)
    .join("\n");

  return `## Built-in Functions

Pure data functions. Use PascalCase like components. These are the ONLY functions available.

${lines}
Each(array, varName, template) — Render a component for each element. varName is the iterator variable (your choice of name). Access fields via varName.field.

Example: Count(metrics.data), Sum(endpoints.endpoints.requests), Filter(items, "status", "==", "active")

Each examples:
- Render cards per issue: Each(issues, issue, Card([TextContent(issue.title, "small-heavy"), Tag(issue.priority)]))
- Funnel bars: Each(funnelData.steps, step, Stack([TextContent(step.name), TextContent("" + step.users + " users")], "row"))
- With Filter: Each(Filter(tickets, "status", "==", "open"), ticket, Card([TextContent(ticket.title)]))

IMPORTANT: Use Each() to render components per array item. Do NOT use .map(), =>, or JavaScript. Use dot access for field extraction (data.rows.title), Each() for per-item rendering.`;
}

function querySection(): string {
  return `## Query — Live Data Fetching

Fetch data from available tools. Returns defaults instantly, swaps in real data when it arrives.

\`\`\`
metrics = Query("tool_name", {arg1: value, arg2: $binding}, {defaultField: 0, defaultData: []}, refreshInterval?)
\`\`\`

- First arg: tool name (string)
- Second arg: arguments object (may reference $bindings — re-fetches automatically on change)
- Third arg: default data (rendered immediately before fetch resolves)
- Fourth arg (optional): refresh interval in seconds (e.g. 30 for auto-refresh every 30s)
- Use dot access on results: metrics.totalEvents, metrics.data.day (array pluck)
- Query results must use regular identifiers: \`metrics = Query(...)\`, NOT \`$metrics = Query(...)\`
- Manual refresh: \`Button("Refresh", Action([Run(metrics)]))\` — re-fetches the named query
- Refresh all queries: create Action with Run for each query`;
}

function mutationSection(): string {
  return `## Mutation — Write Operations

Execute state-changing tool calls (create, update, delete). Unlike Query (auto-fetches on render), Mutation fires only on button click via Action.

\`\`\`
result = Mutation("tool_name", {arg1: $binding, arg2: "value"})
\`\`\`

- First arg: tool name (string)
- Second arg: arguments object (evaluated with current $binding values at click time)
- result.status: "idle" | "loading" | "success" | "error"
- result.data: tool response on success
- result.error: error message on failure
- Mutation results use regular identifiers: \`result = Mutation(...)\`, NOT \`$result\`
- Show loading state: \`result.status == "loading" ? TextContent("Saving...") : null\``;
}

function actionSection(): string {
  return `## Action — Button Behavior (only used as Button's action prop)

Action([steps...]) wires button clicks to operations. Steps execute in order. Halts if a mutation fails.
Only use Action when a button needs to trigger a Mutation, re-fetch a Query, or navigate. Buttons without an action prop default to sending their label to the LLM.

Available steps:
- Run(queryOrMutationRef) — Execute a Mutation or re-fetch a Query (ref must be a declared Query/Mutation)
- ToLLM("message") or ToLLM("label", "context") — Send a message to the LLM. First arg is displayed as user message, optional second arg is context passed to the host app.
- OpenUrl("https://...") — Navigate to a URL

Example — create + refresh:
\`\`\`
createResult = Mutation("create_ticket", {title: $title})
tickets = Query("list_tickets", {}, {columns: [], results: []})
onSubmit = Action([Run(createResult), Run(tickets)])
submitBtn = Button("Create", onSubmit)
\`\`\`

Example — mutation + refresh + notify:
\`\`\`
createResult = Mutation("create_issue", {title: $title})
issues = Query("list_issues", {}, {columns: [], results: []})
onSubmit = Action([Run(createResult), Run(issues), ToLLM("Issue created")])
submitBtn = Button("Create", onSubmit)
\`\`\`

Example — simple nav:
\`\`\`
viewBtn = Button("View", Action([OpenUrl("https://example.com")]))
\`\`\`

Example — form submit with context:
\`\`\`
submitBtn = Button("Submit", Action([ToLLM("Submit", "User submitted the contact form")]))
\`\`\`

Buttons without an action default to ToLLM with their label:
\`\`\`
Button("Tell me more")
// equivalent to: Button("Tell me more", Action([ToLLM("Tell me more")]))
\`\`\`

- Action can be assigned to a variable or inlined: Button("Go", onSubmit) and Button("Go", Action([...])) both work
- If a Run(mutation) step fails, remaining steps are skipped (halt on failure)
- Run(queryRef) re-fetches the query (fire-and-forget, cannot fail)`;
}

function interactiveFiltersSection(): string {
  return `## Interactive Filters

To let the user filter data with a dropdown:
1. Declare a $variable with a default: \`$dateRange = "14"\`
2. Create a Select with name, binding, and items: \`Select("dateRange", $dateRange, [SelectItem("7", "Last 7 days"), ...])\`
3. Wrap in FormControl for a label: \`FormControl("Date Range", Select(...))\`
4. Pass $dateRange in Query args: \`Query("tool", {dateRange: $dateRange}, {defaults})\`
5. When the user changes the Select, $dateRange updates and the Query automatically re-fetches

Rules for $variables:
- $variables hold simple values (strings or numbers), NOT arrays or objects
- $variables must be bound to a Select/Input component via the value argument to be interactive
- Queries must use regular identifiers (NOT $variables): \`metrics = Query(...)\` not \`$metrics = Query(...)\`
- **Auto-declare**: You do NOT need to explicitly declare $variables. If you use \`$foo\` without declaring it, the parser auto-creates \`$foo = null\`. You can still declare explicitly to set a default: \`$days = "14"\`

## Forms

Simple form — no $bindings needed. Field values are managed internally by the Form via the name prop:
\`\`\`
contactForm = Form("contact", submitBtn, [nameField, emailField])
nameField = FormControl("Name", Input("name"))
emailField = FormControl("Email", Input("email", "email"))
submitBtn = Button("Submit")
\`\`\`

Use $bindings when you need to read field values elsewhere (in Action context, Query args, or conditionals). They are auto-declared:
\`\`\`
$role = "engineer"
contactForm = Form("contact", submitBtn, [nameField, emailField, roleField])
nameField = FormControl("Name", Input("name", $name, "Enter your name"))
emailField = FormControl("Email", Input("email", $email, "Enter your email"))
roleField = FormControl("Role", Select("role", $role, [SelectItem("engineer", "Engineer"), SelectItem("designer", "Designer"), SelectItem("pm", "PM")]))
submitBtn = Button("Submit", Action([ToLLM("Contact form", "name: " + $name + ", email: " + $email + ", role: " + $role)]))
\`\`\`

Form with mutation (saves to backend then refreshes a query):
\`\`\`
$priority = "medium"
saveResult = Mutation("create_ticket", {title: $title, priority: $priority})
tickets = Query("list_tickets", {}, {columns: [], results: []})
createForm = Form("ticket", submitBtn, [titleField, priorityField])
titleField = FormControl("Title", Input("title", $title, "Ticket title"))
priorityField = FormControl("Priority", Select("priority", $priority, [SelectItem("low", "Low"), SelectItem("medium", "Medium"), SelectItem("high", "High")]))
submitBtn = Button("Create", Action([Run(saveResult), Run(tickets), ToLLM("Ticket created")]))
\`\`\`

Field component syntax: \`Input(name, value?, placeholder?, type?, rules?)\`
- name: string — field identity
- value: $binding — reactive binding for the field value
- placeholder: string — hint text`;
}

function editModeSection(): string {
  return `## Edit Mode

The runtime merges by statement name: same name = replace, new name = append.
Output ONLY statements that changed or are new. Everything else is kept automatically.

### Delete
To remove a component, just update the parent to exclude it. Orphaned statements are automatically garbage-collected.
Example — remove chart: \`root = Stack([header, kpiRow, table])\` — the chart and any statements only it referenced are auto-deleted.
You can also explicitly delete: \`chart = null\`

### Patch size guide
- Changing a title or label: 1 statement
- Adding a component: 2-3 statements (the new component + parent update)
- Removing a component: 1 statement (update parent to exclude it)
- Adding a filter + wiring to query: 3-5 statements
- Restructuring into tabs: 5-10 statements

### Rules
- Reuse existing statement names exactly — do not rename
- Do NOT re-emit unchanged statements — the runtime keeps them
- A typical edit patch is 1-10 statements, not 20+
- If the existing code already satisfies the request, output only the root statement
- NEVER output the entire program as a patch. Only output what actually changes
- If you are about to output more than 10 statements, reconsider — most edits need fewer`;
}

function streamingRules(rootName: string): string {
  return `## Hoisting & Streaming (CRITICAL)

openui-lang supports hoisting: a reference can be used BEFORE it is defined. The parser resolves all references after the full input is parsed.

During streaming, the output is re-parsed on every chunk. Undefined references are temporarily unresolved and appear once their definitions stream in. This creates a progressive top-down reveal — structure first, then data fills in.

**Recommended statement order for optimal streaming:**
1. \`root = ${rootName}(...)\` — UI shell appears immediately
2. $variable declarations — state ready for bindings
3. Query statements — defaults resolve immediately so components render with data
4. Component definitions — fill in with data already available
5. Data values — leaf content last

Always write the root = ${rootName}(...) statement first so the UI shell appears immediately, even before child data has streamed in.`;
}

function importantRules(rootName: string): string {
  return `## Important Rules
- ALWAYS start with root = ${rootName}(...)
- Write statements in TOP-DOWN order: root → components → data (leverages hoisting for progressive streaming)
- Each statement on its own line
- No trailing text or explanations — output ONLY openui-lang code
- Use ONLY the built-in functions listed above — do not invent others
- When asked about data, generate realistic/plausible data
- Choose components that best represent the content (tables for comparisons, charts for trends, forms for input, etc.)
- NEVER define a variable without referencing it from the tree. Every variable must be reachable from root, otherwise it will not render.
- Do not fabricate tool names — only use tools from the available list

## Final Verification
Before finishing, walk your output and verify:
1. root = ${rootName}([...]) is the FIRST line.
2. Every name in root's children list is defined below.
3. Every defined name (other than root) appears in at least one other reachable statement. If not, delete it.
4. Every Query result is referenced by at least one component. If not, delete the Query.
5. Every $binding appears in at least one component or expression. $bindings used only for conditional display (e.g. $tab == "chart" ? ...) do not need a Query.
6. No markdown, prose, or comments — only openui-lang.`;
}

function getZodDef(schema: unknown): any {
  return (schema as any)?._zod?.def;
}

function getZodType(schema: unknown): string | undefined {
  return getZodDef(schema)?.type;
}

function isOptionalType(schema: unknown): boolean {
  return getZodType(schema) === "optional";
}

function unwrapOptional(schema: unknown): unknown {
  const def = getZodDef(schema);
  if (def?.type === "optional") return def.innerType;
  return schema;
}

/** Strip optional wrapper to reach the core schema. */
function unwrap(schema: unknown): unknown {
  return unwrapOptional(schema);
}

function isArrayType(schema: unknown): boolean {
  const s = unwrap(schema);
  return getZodType(s) === "array";
}

function getArrayInnerType(schema: unknown): unknown | undefined {
  const s = unwrap(schema);
  const def = getZodDef(s);
  if (def?.type === "array") return def.element ?? def.innerType;
  return undefined;
}

function getEnumValues(schema: unknown): string[] | undefined {
  const s = unwrap(schema);
  const def = getZodDef(s);
  if (def?.type !== "enum") return undefined;
  if (Array.isArray(def.values)) return def.values;
  if (def.entries && typeof def.entries === "object") return Object.keys(def.entries);
  return undefined;
}

function getSchemaId(schema: unknown): string | undefined {
  try {
    const meta = z.globalRegistry.get(schema as z.ZodType);
    return meta?.id;
  } catch {
    return undefined;
  }
}

function getUnionOptions(schema: unknown): unknown[] | undefined {
  const def = getZodDef(schema);
  if (def?.type === "union" && Array.isArray(def.options)) return def.options;
  return undefined;
}

function getObjectShape(schema: unknown): Record<string, unknown> | undefined {
  const def = getZodDef(schema);
  if (def?.type === "object" && def.shape && typeof def.shape === "object")
    return def.shape as Record<string, unknown>;
  return undefined;
}

/**
 * Resolve the type annotation for a schema field.
 * Returns a human-readable type string for the schema.
 * If the schema is marked reactive(), prefixes with "$binding<...>".
 */
function resolveTypeAnnotation(schema: unknown): string | undefined {
  // Check for reactive marker
  const isReactive = isReactiveSchema(schema);
  const inner = unwrap(schema);

  const baseType = resolveBaseType(inner);
  if (!baseType) return undefined;
  return isReactive ? `$binding<${baseType}>` : baseType;
}

function resolveBaseType(inner: unknown): string | undefined {
  const directId = getSchemaId(inner);
  if (directId) return directId;

  const unionOpts = getUnionOptions(inner);
  if (unionOpts) {
    const resolved = unionOpts.map((o) => resolveTypeAnnotation(o));
    const names = resolved.filter(Boolean) as string[];
    if (names.length > 0) return names.join(" | ");
  }

  if (isArrayType(inner)) {
    const arrayInner = getArrayInnerType(inner);
    if (!arrayInner) return undefined;
    const innerType = resolveTypeAnnotation(arrayInner);
    if (innerType) {
      const isUnion = getUnionOptions(unwrap(arrayInner)) !== undefined;
      return isUnion ? `(${innerType})[]` : `${innerType}[]`;
    }
    return undefined;
  }

  const zodType = getZodType(inner);
  if (zodType === "string") return "string";
  if (zodType === "number") return "number";
  if (zodType === "boolean") return "boolean";

  const enumVals = getEnumValues(inner);
  if (enumVals) return enumVals.map((v) => `"${v}"`).join(" | ");

  if (zodType === "literal") {
    const vals = getZodDef(inner)?.values;
    if (Array.isArray(vals) && vals.length === 1) {
      const v = vals[0];
      return typeof v === "string" ? `"${v}"` : String(v);
    }
  }

  const shape = getObjectShape(inner);
  if (shape) {
    const fields = Object.entries(shape).map(([name, fieldSchema]) => {
      const opt = isOptionalType(fieldSchema) ? "?" : "";
      const fieldType = resolveTypeAnnotation(fieldSchema as z.ZodType);
      return fieldType ? `${name}${opt}: ${fieldType}` : `${name}${opt}`;
    });
    return `{${fields.join(", ")}}`;
  }

  return undefined;
}

// ─── Field analysis ───

interface FieldInfo {
  name: string;
  isOptional: boolean;
  isArray: boolean;
  typeAnnotation?: string;
}

function analyzeFields(shape: Record<string, z.ZodType>): FieldInfo[] {
  return Object.entries(shape).map(([name, schema]) => ({
    name,
    isOptional: isOptionalType(schema),
    isArray: isArrayType(schema),
    typeAnnotation: resolveTypeAnnotation(schema),
  }));
}

// ─── Signature generation ───

function buildSignature(componentName: string, fields: FieldInfo[]): string {
  const params = fields.map((f) => {
    if (f.typeAnnotation) {
      return f.isOptional ? `${f.name}?: ${f.typeAnnotation}` : `${f.name}: ${f.typeAnnotation}`;
    }
    if (f.isArray) {
      return f.isOptional ? `[${f.name}]?` : `[${f.name}]`;
    }
    return f.isOptional ? `${f.name}?` : f.name;
  });
  return `${componentName}(${params.join(", ")})`;
}

function buildComponentLine(componentName: string, def: DefinedComponent): string {
  const fields = analyzeFields(def.props.shape);
  const sig = buildSignature(componentName, fields);
  if (def.description) {
    return `${sig} — ${def.description}`;
  }
  return sig;
}

// ─── Prompt assembly ───

function generateComponentSignatures(library: Library): string {
  const lines: string[] = [
    "## Component Signatures",
    "",
    "Arguments marked with ? are optional. Sub-components can be inline or referenced; prefer references for better streaming.",
    "Props typed `ActionExpression` accept an Action([steps...]) expression. See the Action section for available steps (Run, ToLLM, OpenUrl).",
    "Props marked `$binding<type>` accept a `$variable` reference for two-way binding.",
  ];

  if (library.componentGroups?.length) {
    const groupedComponents = new Set<string>();

    for (const group of library.componentGroups) {
      lines.push("");
      lines.push(`### ${group.name}`);
      for (const name of group.components) {
        if (groupedComponents.has(name)) continue;
        const def = library.components[name];
        if (!def) continue;
        groupedComponents.add(name);
        lines.push(buildComponentLine(name, def));
      }
      if (group.notes?.length) {
        for (const note of group.notes) {
          lines.push(note);
        }
      }
    }

    const ungrouped = Object.keys(library.components).filter(
      (name) => !groupedComponents.has(name),
    );
    if (ungrouped.length) {
      lines.push("");
      lines.push("### Ungrouped");
      for (const name of ungrouped) {
        const def = library.components[name];
        lines.push(buildComponentLine(name, def));
      }
    }
  } else {
    lines.push("");
    for (const [name, def] of Object.entries(library.components)) {
      lines.push(buildComponentLine(name, def));
    }
  }

  return lines.join("\n");
}

export function generatePrompt(library: Library, options?: PromptOptions): string {
  const rootName = library.root ?? "Root";
  const hasBindings = !!options?.tools?.length;
  const parts: string[] = [];

  parts.push(options?.preamble ?? PREAMBLE);
  parts.push("");
  parts.push(syntaxRules(rootName, hasBindings));
  parts.push("");
  parts.push(generateComponentSignatures(library));

  // Built-in functions
  if (hasBindings) {
    parts.push("");
    parts.push(builtinFunctionsSection());
  }

  // Query + Mutation + Action sections
  if (hasBindings) {
    parts.push("");
    parts.push(querySection());
    parts.push("");
    parts.push(mutationSection());
    parts.push("");
    parts.push(actionSection());
    parts.push("");
    parts.push(interactiveFiltersSection());
  }

  // Tools list
  if (options?.tools?.length) {
    parts.push("");
    parts.push("## Available Query Tools");
    parts.push("");
    for (const tool of options.tools) {
      if (typeof tool === "string") {
        parts.push(`- ${tool}`);
      } else {
        // inputSchema may be a JSON Schema object ({ type, properties }) or a flat { param: type } map
        let args = "";
        if (tool.inputSchema) {
          const props = (tool.inputSchema as any).properties ?? tool.inputSchema;
          args = Object.entries(props)
            .filter(([k]) => k !== "type" && k !== "required" && k !== "properties")
            .map(([k, v]) => {
              const t = typeof v === "string" ? v : ((v as any)?.type ?? "any");
              return `${k}: ${t}`;
            })
            .join(", ");
        }
        parts.push(`- ${tool.name}(${args})${tool.description ? ` — ${tool.description}` : ""}`);
      }
    }
  }

  parts.push("");
  parts.push(streamingRules(rootName));

  const examples = options?.examples;
  if (examples?.length) {
    parts.push("");
    parts.push("## Examples");
    parts.push("");
    for (const ex of examples) {
      parts.push(ex);
      parts.push("");
    }
  }

  // Edit mode instructions
  if (options?.editMode) {
    parts.push("");
    parts.push(editModeSection());
  }

  parts.push(importantRules(rootName));

  if (options?.additionalRules?.length) {
    parts.push("");
    for (const rule of options.additionalRules) {
      parts.push(`- ${rule}`);
    }
  }

  return parts.join("\n");
}
