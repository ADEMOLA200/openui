import { buildJsonSystemPrompt } from "./formats/json.js";
import { buildLangSystemPrompt } from "./formats/lang.js";
import { documents } from "./schemas.js";

for (const doc of documents) {
  const jsonPrompt = buildJsonSystemPrompt(doc.zodSchema);
  const langPrompt = buildLangSystemPrompt(doc.langSchema);

  console.log(`\n${"=".repeat(80)}`);
  console.log(`DOC: ${doc.name} (${doc.id})`);
  console.log(`${"=".repeat(80)}`);

  console.log(`\n--- JSON SYSTEM PROMPT (${jsonPrompt.length} chars) ---\n`);
  console.log(jsonPrompt);

  console.log(`\n--- LANG SYSTEM PROMPT (${langPrompt.length} chars) ---\n`);
  console.log(langPrompt);
}
