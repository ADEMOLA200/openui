// ── Library (framework-generic) ──
export { createLibrary, defineComponent } from "./library";
export type {
  ComponentGroup,
  ComponentRenderProps,
  DefinedComponent,
  Library,
  LibraryDefinition,
  LibraryJSONSchema,
  PromptOptions,
  SubComponentOf,
  ToolDescriptor,
} from "./library";

// ── Parser ──
export { createParser, createStreamingParser, parse } from "./parser";
export type { Parser, StreamParser } from "./parser";
export { generatePrompt } from "./parser/prompt";
export type { ComponentPromptSpec, McpToolSpec, PromptSpec } from "./parser/prompt";
export { mergeStatements } from "./parser/merge";
export { ACTION_NAMES, ACTION_STEPS, BUILTINS, BUILTIN_NAMES, LAZY_BUILTINS, isBuiltin, toNumber } from "./parser/builtins";
export type { BuiltinDef } from "./parser/builtins";
export { BuiltinActionType } from "./parser/types";
export type {
  ActionEvent,
  ActionPlan,
  ActionStep,
  ElementNode,
  MutationStatementInfo,
  OpenUIError,
  ParseResult,
  QueryStatementInfo,
  ValidationError,
  ValidationErrorCode,
} from "./parser/types";
export { isASTNode, isRuntimeExpr } from "./parser/ast";
export type { ASTNode, CallNode, RuntimeExprNode, Statement } from "./parser/ast";

// ── Reactive schema marker ──
export { isReactiveSchema, markReactive } from "./reactive";

// ── Validation ──
export { builtInValidators, parseRules, parseStructuredRules, validate } from "./utils/validation";
export type { ParsedRule, ValidatorFn } from "./utils/validation";
