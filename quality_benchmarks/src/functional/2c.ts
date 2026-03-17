import { z } from "zod";
import { defineModel, createSchema } from "@openuidev/lang/structured-outputs";
import { chk, type FunctionalTestCase, type FunctionalTestSuite, type VerificationResult } from "./domain.js";

// ---- Schema ----

const Transition = z.object({
  source: z.string(),
  target: z.string(),
  event: z.string(),
  guard: z.string().optional(),
  action: z.string().optional(),
});

const StateMachineSchema = z.object({
  name: z.string(),
  initialState: z.string(),
  terminalStates: z.array(z.string()),
  states: z.array(z.string()),
  transitions: z.array(Transition),
});

const JoinCondition = z.object({
  targetState: z.string(),
  requiredStates: z.array(z.string()).describe("All of these states must be reached before the join fires"),
  failState: z.string().describe("State to enter if any required state's failure counterpart is reached"),
  failStates: z.array(z.string()).describe("If any of these states are reached, transition to failState instead"),
});

const HardStateMachineSchema = z.object({
  name: z.string(),
  initialState: z.string(),
  terminalStates: z.array(z.string()),
  states: z.array(z.string()),
  transitions: z.array(Transition),
  joinConditions: z.array(JoinCondition).optional(),
  forkTransitions: z.array(
    z.object({
      source: z.string(),
      targets: z.array(z.string()),
      event: z.string(),
      action: z.string().optional(),
    })
  ).optional(),
});

type StateMachineData = z.infer<typeof StateMachineSchema>;
type HardStateMachineData = z.infer<typeof HardStateMachineSchema>;
type TransitionData = z.infer<typeof Transition>;
type JoinConditionData = z.infer<typeof JoinCondition>;

// ---- Guard Evaluator ----

function preprocessGuard(guard: string): string {
  return guard
    .replace(/ OR /g, " || ")
    .replace(/ AND /g, " && ")
    .replace(/(\w+) is not empty/g, '$1 !== ""')
    .replace(/(\w+) is empty/g, '$1 === ""');
}

function evalGuard(guard: string, context: Record<string, unknown>): boolean {
  try {
    const processed = preprocessGuard(guard);
    const keys = Object.keys(context);
    const vals = keys.map((k) => context[k]);
    const fn = new Function(...keys, `"use strict"; return !!(${processed});`);
    return fn(...vals) as boolean;
  } catch {
    return false;
  }
}

// ---- State Machine Interpreter (Medium) ----

interface BlockedEvent {
  index: number;
  event: string;
  reason: string;
}

interface RunResult {
  finalState: string;
  path: string[];
  blockedEvents: BlockedEvent[];
}

function runStateMachine(
  machine: StateMachineData,
  events: Array<{ name: string; context: Record<string, unknown> }>
): RunResult {
  let currentState = machine.initialState;
  const path: string[] = [currentState];
  const blockedEvents: BlockedEvent[] = [];

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    // Find matching transition
    const candidates = machine.transitions.filter(
      (t) => t.source === currentState && t.event === ev.name
    );

    if (candidates.length === 0) {
      blockedEvents.push({ index: i, event: ev.name, reason: "no_transition" });
      continue;
    }

    let fired = false;
    for (const t of candidates) {
      if (t.guard) {
        if (!evalGuard(t.guard, ev.context)) {
          continue;
        }
      }
      currentState = t.target;
      path.push(currentState);
      fired = true;
      break;
    }

    if (!fired) {
      blockedEvents.push({ index: i, event: ev.name, reason: "guard_failed" });
    }
  }

  return { finalState: currentState, path, blockedEvents };
}

// ---- State Machine Interpreter (Hard — parallel) ----

interface HardRunResult {
  finalState: string | string[];
  path: Array<string | string[]>;
  blockedEvents: BlockedEvent[];
}

function runHardStateMachine(
  machine: HardStateMachineData,
  events: Array<{ name: string; context: Record<string, unknown> }>
): HardRunResult {
  // activeStates: a Set of current states (for parallel execution)
  let activeStates = new Set<string>([machine.initialState]);
  const path: Array<string | string[]> = [machine.initialState];
  const blockedEvents: BlockedEvent[] = [];

  const joinConditions: JoinConditionData[] = machine.joinConditions ?? [];

  // Helper: record path entry — if single state, record string; if multiple, record array
  function recordPath() {
    const arr = Array.from(activeStates);
    if (arr.length === 1) {
      path.push(arr[0]);
    } else {
      path.push(arr);
    }
  }

  // Helper: check if join conditions are met and advance
  function checkJoins() {
    for (const jc of joinConditions) {
      // Check fail condition first
      const hasFail = jc.failStates.some((fs) => activeStates.has(fs));
      if (hasFail) {
        // Transition to fail state — remove all parallel states and add failState
        for (const fs of jc.failStates) activeStates.delete(fs);
        for (const rs of jc.requiredStates) activeStates.delete(rs);
        activeStates.add(jc.failState);
        recordPath();
        return; // re-evaluate after state change is handled by caller
      }

      // Check success condition
      const allRequired = jc.requiredStates.every((rs) => activeStates.has(rs));
      if (allRequired) {
        // Remove all required states and add target
        for (const rs of jc.requiredStates) activeStates.delete(rs);
        activeStates.add(jc.targetState);
        recordPath();
        return;
      }
    }
  }

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];

    // Check forks first: can any active state fork on this event?
    const forkTransitions = machine.forkTransitions ?? [];
    let forked = false;
    for (const ft of forkTransitions) {
      if (activeStates.has(ft.source) && ft.event === ev.name) {
        activeStates.delete(ft.source);
        for (const t of ft.targets) activeStates.add(t);
        recordPath();
        forked = true;
        break;
      }
    }

    if (forked) {
      checkJoins();
      continue;
    }

    // Process normal transitions from all active states
    let anyFired = false;
    let guardFailed = false;
    const newStates = new Set<string>(activeStates);

    for (const state of Array.from(activeStates)) {
      const candidates = machine.transitions.filter(
        (t) => t.source === state && t.event === ev.name
      );
      if (candidates.length === 0) continue;

      let fired = false;
      for (const t of candidates) {
        if (t.guard) {
          if (!evalGuard(t.guard, ev.context)) {
            guardFailed = true;
            continue;
          }
        }
        newStates.delete(state);
        newStates.add(t.target);
        fired = true;
        anyFired = true;
        break;
      }
      if (!fired && candidates.length > 0) {
        guardFailed = true;
      }
    }

    if (!anyFired) {
      if (guardFailed) {
        blockedEvents.push({ index: i, event: ev.name, reason: "guard_failed" });
      } else {
        blockedEvents.push({ index: i, event: ev.name, reason: "no_transition" });
      }
      continue;
    }

    activeStates = newStates;
    recordPath();
    checkJoins();
  }

  const arr = Array.from(activeStates);
  const finalState = arr.length === 1 ? arr[0] : arr;
  return { finalState, path, blockedEvents };
}

// ---- Verification helpers ----

function verifyScenario(
  machine: StateMachineData,
  events: Array<{ name: string; context: Record<string, unknown> }>,
  expectedFinalState: string,
  expectedPath?: string[],
  expectedBlocked?: { index: number; event: string; reason: string },
  label?: string
): ReturnType<typeof chk>[] {
  const checks: ReturnType<typeof chk>[] = [];
  const result = runStateMachine(machine, events);
  const pfx = label ? `${label}: ` : "";

  checks.push(chk(`${pfx}final_state`, result.finalState === expectedFinalState, result.finalState, expectedFinalState));

  if (expectedPath) {
    const pathMatch = JSON.stringify(result.path) === JSON.stringify(expectedPath);
    checks.push(chk(`${pfx}path`, pathMatch, result.path, expectedPath));
  }

  if (expectedBlocked) {
    const found = result.blockedEvents.find(
      (b) => b.index === expectedBlocked.index && b.event === expectedBlocked.event && b.reason === expectedBlocked.reason
    );
    checks.push(chk(`${pfx}blocked_event`, !!found, result.blockedEvents, expectedBlocked));
  }

  return checks;
}

// ---- Medium Test Case ----

const mediumPrompt = `Generate a state machine for an e-commerce order lifecycle with the following requirements:

States:
- draft: initial state, order is being composed
- submitted: order has been placed by the customer
- payment_pending: awaiting payment confirmation
- payment_failed: payment was declined
- confirmed: payment received, order confirmed
- processing: order is being prepared
- shipped: order has been handed to carrier
- delivered: order received by customer
- cancelled: order was cancelled
- refund_pending: refund has been requested
- refunded: refund completed

Transitions:
- draft → submitted: event "place_order", guard: items_count > 0
- submitted → payment_pending: event "initiate_payment"
- payment_pending → confirmed: event "payment_success"
- payment_pending → payment_failed: event "payment_declined"
- payment_failed → payment_pending: event "retry_payment", guard: retry_count < 3
- payment_failed → cancelled: event "cancel_order"
- confirmed → processing: event "start_processing"
- processing → shipped: event "ship_order", guard: tracking_number is not empty
- shipped → delivered: event "confirm_delivery"
- delivered → refund_pending: event "request_refund", guard: days_since_delivery <= 30
- refund_pending → refunded: event "process_refund"
- refund_pending → delivered: event "deny_refund"

Cancellation rules:
- submitted → cancelled: event "cancel_order"
- payment_pending → cancelled: event "cancel_order"
- confirmed → cancelled: event "cancel_order"

Terminal states: delivered, cancelled, refunded (no transitions out)

For each transition, define:
- source state
- target state
- event name
- guard condition (if any)
- action to execute (a descriptive string, e.g., "send_confirmation_email", "charge_payment", "release_inventory")`;

const REQUIRED_STATES_MEDIUM = [
  "draft", "submitted", "payment_pending", "payment_failed",
  "confirmed", "processing", "shipped", "delivered",
  "cancelled", "refund_pending", "refunded",
];

const REQUIRED_TRANSITIONS_MEDIUM: Array<{ source: string; target: string; event: string }> = [
  { source: "draft", target: "submitted", event: "place_order" },
  { source: "submitted", target: "payment_pending", event: "initiate_payment" },
  { source: "payment_pending", target: "confirmed", event: "payment_success" },
  { source: "payment_pending", target: "payment_failed", event: "payment_declined" },
  { source: "payment_failed", target: "payment_pending", event: "retry_payment" },
  { source: "payment_failed", target: "cancelled", event: "cancel_order" },
  { source: "confirmed", target: "processing", event: "start_processing" },
  { source: "processing", target: "shipped", event: "ship_order" },
  { source: "shipped", target: "delivered", event: "confirm_delivery" },
  { source: "delivered", target: "refund_pending", event: "request_refund" },
  { source: "refund_pending", target: "refunded", event: "process_refund" },
  { source: "refund_pending", target: "delivered", event: "deny_refund" },
  { source: "submitted", target: "cancelled", event: "cancel_order" },
  { source: "payment_pending", target: "cancelled", event: "cancel_order" },
  { source: "confirmed", target: "cancelled", event: "cancel_order" },
];

function verifyMediumStateMachine(parsed: unknown): VerificationResult {
  const data = parsed as Partial<StateMachineData>;
  const checks: ReturnType<typeof chk>[] = [];

  // Check all 11 states present
  const states = data.states ?? [];
  for (const s of REQUIRED_STATES_MEDIUM) {
    checks.push(chk(`state:${s}`, states.includes(s), states, s));
  }

  // Check required transitions
  const transitions: TransitionData[] = (data.transitions as TransitionData[]) ?? [];
  for (const req of REQUIRED_TRANSITIONS_MEDIUM) {
    const found = transitions.some(
      (t) => t.source === req.source && t.target === req.target && t.event === req.event
    );
    checks.push(chk(`transition:${req.source}->${req.target}:${req.event}`, found));
  }

  const machine = data as StateMachineData;

  // Scenario 1: Happy path
  checks.push(...verifyScenario(
    machine,
    [
      { name: "place_order", context: { items_count: 3 } },
      { name: "initiate_payment", context: {} },
      { name: "payment_success", context: {} },
      { name: "start_processing", context: {} },
      { name: "ship_order", context: { tracking_number: "TRK-12345" } },
      { name: "confirm_delivery", context: {} },
    ],
    "delivered",
    ["draft", "submitted", "payment_pending", "confirmed", "processing", "shipped", "delivered"],
    undefined,
    "s1"
  ));

  // Scenario 2: Payment retry then success
  checks.push(...verifyScenario(
    machine,
    [
      { name: "place_order", context: { items_count: 1 } },
      { name: "initiate_payment", context: {} },
      { name: "payment_declined", context: {} },
      { name: "retry_payment", context: { retry_count: 1 } },
      { name: "payment_success", context: {} },
      { name: "start_processing", context: {} },
      { name: "ship_order", context: { tracking_number: "TRK-99999" } },
      { name: "confirm_delivery", context: {} },
    ],
    "delivered",
    ["draft", "submitted", "payment_pending", "payment_failed", "payment_pending", "confirmed", "processing", "shipped", "delivered"],
    undefined,
    "s2"
  ));

  // Scenario 3: Payment fails, max retries exceeded, cancel
  checks.push(...verifyScenario(
    machine,
    [
      { name: "place_order", context: { items_count: 2 } },
      { name: "initiate_payment", context: {} },
      { name: "payment_declined", context: {} },
      { name: "retry_payment", context: { retry_count: 3 } },
      { name: "cancel_order", context: {} },
    ],
    "cancelled",
    ["draft", "submitted", "payment_pending", "payment_failed", "cancelled"],
    { index: 3, event: "retry_payment", reason: "guard_failed" },
    "s3"
  ));

  // Scenario 4: Cancel after confirmation
  checks.push(...verifyScenario(
    machine,
    [
      { name: "place_order", context: { items_count: 5 } },
      { name: "initiate_payment", context: {} },
      { name: "payment_success", context: {} },
      { name: "cancel_order", context: {} },
    ],
    "cancelled",
    ["draft", "submitted", "payment_pending", "confirmed", "cancelled"],
    undefined,
    "s4"
  ));

  // Scenario 5: Deliver then refund
  checks.push(...verifyScenario(
    machine,
    [
      { name: "place_order", context: { items_count: 1 } },
      { name: "initiate_payment", context: {} },
      { name: "payment_success", context: {} },
      { name: "start_processing", context: {} },
      { name: "ship_order", context: { tracking_number: "TRK-55555" } },
      { name: "confirm_delivery", context: {} },
      { name: "request_refund", context: { days_since_delivery: 15 } },
      { name: "process_refund", context: {} },
    ],
    "refunded",
    ["draft", "submitted", "payment_pending", "confirmed", "processing", "shipped", "delivered", "refund_pending", "refunded"],
    undefined,
    "s5"
  ));

  // Scenario 6: Refund denied due to time limit
  checks.push(...verifyScenario(
    machine,
    [
      { name: "place_order", context: { items_count: 1 } },
      { name: "initiate_payment", context: {} },
      { name: "payment_success", context: {} },
      { name: "start_processing", context: {} },
      { name: "ship_order", context: { tracking_number: "TRK-77777" } },
      { name: "confirm_delivery", context: {} },
      { name: "request_refund", context: { days_since_delivery: 45 } },
    ],
    "delivered",
    ["draft", "submitted", "payment_pending", "confirmed", "processing", "shipped", "delivered"],
    { index: 6, event: "request_refund", reason: "guard_failed" },
    "s6"
  ));

  // Scenario 7: Empty cart guard
  checks.push(...verifyScenario(
    machine,
    [
      { name: "place_order", context: { items_count: 0 } },
    ],
    "draft",
    ["draft"],
    { index: 0, event: "place_order", reason: "guard_failed" },
    "s7"
  ));

  return { pass: checks.every((c) => c.pass), checks };
}

// ---- Hard Test Case ----

const hardPrompt = `Generate a state machine for a multi-stage CI/CD pipeline with parallel execution, approval gates, and rollback capabilities.

States:
- idle: waiting for trigger
- source_checkout: checking out source code
- checkout_failed: source checkout failed

- build_started: build phase initiated
- unit_tests: running unit tests in parallel with lint
- lint: running linter in parallel with unit tests
- unit_tests_passed: unit tests completed successfully
- unit_tests_failed: unit tests failed
- lint_passed: lint completed successfully
- lint_failed: lint failed
- build_complete: both unit_tests and lint passed (join state — requires BOTH parallel branches to complete)
- build_failed: either unit_tests or lint failed

- integration_tests: running integration tests
- integration_passed: integration tests passed
- integration_failed: integration tests failed

- staging_deploy: deploying to staging environment
- staging_deployed: staging deployment complete
- staging_deploy_failed: staging deployment failed
- staging_validation: running smoke tests on staging
- staging_validated: staging validation passed
- staging_validation_failed: staging validation failed

- approval_pending: waiting for manual approval to deploy to production
- approval_granted: approval received
- approval_rejected: approval denied

- prod_deploy: deploying to production
- prod_deployed: production deployment complete
- prod_deploy_failed: production deployment failed
- prod_validation: running production health checks
- prod_validated: production health checks passed (final success state)
- prod_validation_failed: production health checks failed

- rollback_initiated: rollback in progress
- rollback_complete: rollback finished, system restored
- pipeline_aborted: pipeline was manually aborted

Transitions:
- idle → source_checkout: event "trigger_pipeline", guard: branch is not empty
- source_checkout → build_started: event "checkout_success"
- source_checkout → checkout_failed: event "checkout_error"
- checkout_failed → source_checkout: event "retry", guard: retry_count < 2

- build_started → unit_tests: event "start_parallel_build" (this also simultaneously moves to lint — model must represent parallel fork)
- build_started → lint: event "start_parallel_build"
- unit_tests → unit_tests_passed: event "tests_pass"
- unit_tests → unit_tests_failed: event "tests_fail"
- lint → lint_passed: event "lint_pass"
- lint → lint_failed: event "lint_fail"
- build_complete requires BOTH unit_tests_passed AND lint_passed (join condition)
- build_failed if EITHER unit_tests_failed OR lint_failed

- build_complete → integration_tests: event "start_integration"
- build_failed → idle: event "reset_pipeline"
- integration_tests → integration_passed: event "integration_pass"
- integration_tests → integration_failed: event "integration_fail"
- integration_failed → integration_tests: event "retry", guard: retry_count < 2

- integration_passed → staging_deploy: event "deploy_staging"
- staging_deploy → staging_deployed: event "staging_deploy_success"
- staging_deploy → staging_deploy_failed: event "staging_deploy_error"
- staging_deploy_failed → staging_deploy: event "retry", guard: retry_count < 2
- staging_deployed → staging_validation: event "validate_staging"
- staging_validation → staging_validated: event "staging_checks_pass"
- staging_validation → staging_validation_failed: event "staging_checks_fail"
- staging_validation_failed → staging_deploy: event "redeploy_staging"

- staging_validated → approval_pending: event "request_approval"
- approval_pending → approval_granted: event "approve", guard: approver_role == "lead" OR approver_role == "admin"
- approval_pending → approval_rejected: event "reject"
- approval_rejected → idle: event "reset_pipeline"

- approval_granted → prod_deploy: event "deploy_production"
- prod_deploy → prod_deployed: event "prod_deploy_success"
- prod_deploy → prod_deploy_failed: event "prod_deploy_error"
- prod_deploy_failed → rollback_initiated: event "initiate_rollback"
- prod_deployed → prod_validation: event "validate_production"
- prod_validation → prod_validated: event "prod_checks_pass"
- prod_validation → prod_validation_failed: event "prod_checks_fail"
- prod_validation_failed → rollback_initiated: event "initiate_rollback"

- rollback_initiated → rollback_complete: event "rollback_success"
- rollback_complete → idle: event "reset_pipeline"

Abort rules (these apply from multiple states):
- source_checkout → pipeline_aborted: event "abort"
- build_started → pipeline_aborted: event "abort"
- unit_tests → pipeline_aborted: event "abort"
- lint → pipeline_aborted: event "abort"
- integration_tests → pipeline_aborted: event "abort"
- staging_deploy → pipeline_aborted: event "abort"
- staging_validation → pipeline_aborted: event "abort"
- approval_pending → pipeline_aborted: event "abort"
- prod_deploy → pipeline_aborted: event "abort"

Terminal states: prod_validated, pipeline_aborted, rollback_complete

For each transition, define source, target, event, guard (if any), and action.

IMPORTANT: The parallel fork (build_started → unit_tests + lint) and join (unit_tests_passed + lint_passed → build_complete) require special handling. Represent the fork as two transitions from build_started, and the join as a state that requires both conditions. The schema supports a "join_condition" field for this.`;

const REQUIRED_STATES_HARD = [
  "idle", "source_checkout", "checkout_failed",
  "build_started", "unit_tests", "lint", "unit_tests_passed", "unit_tests_failed",
  "lint_passed", "lint_failed", "build_complete", "build_failed",
  "integration_tests", "integration_passed", "integration_failed",
  "staging_deploy", "staging_deployed", "staging_deploy_failed",
  "staging_validation", "staging_validated", "staging_validation_failed",
  "approval_pending", "approval_granted", "approval_rejected",
  "prod_deploy", "prod_deployed", "prod_deploy_failed",
  "prod_validation", "prod_validated", "prod_validation_failed",
  "rollback_initiated", "rollback_complete", "pipeline_aborted",
];

function pathMatches(actual: Array<string | string[]>, expected: Array<string | string[]>): boolean {
  if (actual.length !== expected.length) return false;
  for (let i = 0; i < actual.length; i++) {
    const a = actual[i];
    const e = expected[i];
    if (Array.isArray(a) && Array.isArray(e)) {
      if (a.length !== e.length) return false;
      const as = [...a].sort();
      const es = [...e].sort();
      if (JSON.stringify(as) !== JSON.stringify(es)) return false;
    } else if (typeof a === "string" && typeof e === "string") {
      if (a !== e) return false;
    } else {
      return false;
    }
  }
  return true;
}

function verifyHardStateMachine(parsed: unknown): VerificationResult {
  const data = parsed as Partial<HardStateMachineData>;
  const checks: ReturnType<typeof chk>[] = [];

  // Check all 33 states present
  const states = data.states ?? [];
  for (const s of REQUIRED_STATES_HARD) {
    checks.push(chk(`state:${s}`, states.includes(s), states, s));
  }

  // Check fork transitions present
  const forkTransitions = data.forkTransitions ?? [];
  const hasFork = forkTransitions.some(
    (ft) => ft.source === "build_started" && ft.targets.includes("unit_tests") && ft.targets.includes("lint")
  );
  checks.push(chk("fork:build_started->unit_tests+lint", hasFork));

  // Check join conditions present
  const joinConditions = data.joinConditions ?? [];
  const hasJoin = joinConditions.some(
    (jc) =>
      jc.targetState === "build_complete" &&
      jc.requiredStates.includes("unit_tests_passed") &&
      jc.requiredStates.includes("lint_passed")
  );
  checks.push(chk("join:unit_tests_passed+lint_passed->build_complete", hasJoin));

  const hasFailJoin = joinConditions.some(
    (jc) =>
      jc.failState === "build_failed" &&
      (jc.failStates.includes("unit_tests_failed") || jc.failStates.includes("lint_failed"))
  );
  checks.push(chk("join_fail:build_failed", hasFailJoin));

  const machine = data as HardStateMachineData;

  // Scenario 1: Full happy path
  {
    const events = [
      { name: "trigger_pipeline", context: { branch: "main" } },
      { name: "checkout_success", context: {} },
      { name: "start_parallel_build", context: {} },
      { name: "tests_pass", context: {} },
      { name: "lint_pass", context: {} },
      { name: "start_integration", context: {} },
      { name: "integration_pass", context: {} },
      { name: "deploy_staging", context: {} },
      { name: "staging_deploy_success", context: {} },
      { name: "validate_staging", context: {} },
      { name: "staging_checks_pass", context: {} },
      { name: "request_approval", context: {} },
      { name: "approve", context: { approver_role: "lead" } },
      { name: "deploy_production", context: {} },
      { name: "prod_deploy_success", context: {} },
      { name: "validate_production", context: {} },
      { name: "prod_checks_pass", context: {} },
    ];
    const result = runHardStateMachine(machine, events);
    const finalOk = result.finalState === "prod_validated" ||
      (Array.isArray(result.finalState) && result.finalState.includes("prod_validated"));
    checks.push(chk("s1:final_state", finalOk, result.finalState, "prod_validated"));
  }

  // Scenario 2: Lint fails, pipeline resets
  {
    const events = [
      { name: "trigger_pipeline", context: { branch: "feature-x" } },
      { name: "checkout_success", context: {} },
      { name: "start_parallel_build", context: {} },
      { name: "tests_pass", context: {} },
      { name: "lint_fail", context: {} },
      { name: "reset_pipeline", context: {} },
    ];
    const result = runHardStateMachine(machine, events);
    const finalOk = result.finalState === "idle" ||
      (Array.isArray(result.finalState) && result.finalState.includes("idle"));
    checks.push(chk("s2:final_state", finalOk, result.finalState, "idle"));
  }

  // Scenario 3: Production deploy fails, rollback
  {
    const events = [
      { name: "trigger_pipeline", context: { branch: "main" } },
      { name: "checkout_success", context: {} },
      { name: "start_parallel_build", context: {} },
      { name: "tests_pass", context: {} },
      { name: "lint_pass", context: {} },
      { name: "start_integration", context: {} },
      { name: "integration_pass", context: {} },
      { name: "deploy_staging", context: {} },
      { name: "staging_deploy_success", context: {} },
      { name: "validate_staging", context: {} },
      { name: "staging_checks_pass", context: {} },
      { name: "request_approval", context: {} },
      { name: "approve", context: { approver_role: "admin" } },
      { name: "deploy_production", context: {} },
      { name: "prod_deploy_error", context: {} },
      { name: "initiate_rollback", context: {} },
      { name: "rollback_success", context: {} },
      { name: "reset_pipeline", context: {} },
    ];
    const result = runHardStateMachine(machine, events);
    const finalOk = result.finalState === "idle" ||
      (Array.isArray(result.finalState) && result.finalState.includes("idle"));
    checks.push(chk("s3:final_state", finalOk, result.finalState, "idle"));
  }

  // Scenario 4: Approval rejected by wrong role
  {
    const events = [
      { name: "trigger_pipeline", context: { branch: "main" } },
      { name: "checkout_success", context: {} },
      { name: "start_parallel_build", context: {} },
      { name: "tests_pass", context: {} },
      { name: "lint_pass", context: {} },
      { name: "start_integration", context: {} },
      { name: "integration_pass", context: {} },
      { name: "deploy_staging", context: {} },
      { name: "staging_deploy_success", context: {} },
      { name: "validate_staging", context: {} },
      { name: "staging_checks_pass", context: {} },
      { name: "request_approval", context: {} },
      { name: "approve", context: { approver_role: "developer" } },
    ];
    const result = runHardStateMachine(machine, events);
    const finalOk = result.finalState === "approval_pending" ||
      (Array.isArray(result.finalState) && result.finalState.includes("approval_pending"));
    checks.push(chk("s4:final_state", finalOk, result.finalState, "approval_pending"));
    const blocked = result.blockedEvents.find(
      (b) => b.index === 12 && b.event === "approve" && b.reason === "guard_failed"
    );
    checks.push(chk("s4:blocked_event", !!blocked, result.blockedEvents));
  }

  // Scenario 5: Abort during integration tests
  {
    const events = [
      { name: "trigger_pipeline", context: { branch: "main" } },
      { name: "checkout_success", context: {} },
      { name: "start_parallel_build", context: {} },
      { name: "tests_pass", context: {} },
      { name: "lint_pass", context: {} },
      { name: "start_integration", context: {} },
      { name: "abort", context: {} },
    ];
    const result = runHardStateMachine(machine, events);
    const finalOk = result.finalState === "pipeline_aborted" ||
      (Array.isArray(result.finalState) && result.finalState.includes("pipeline_aborted"));
    checks.push(chk("s5:final_state", finalOk, result.finalState, "pipeline_aborted"));
  }

  // Scenario 6: Staging validation fails, redeploy, then succeed
  {
    const events = [
      { name: "trigger_pipeline", context: { branch: "main" } },
      { name: "checkout_success", context: {} },
      { name: "start_parallel_build", context: {} },
      { name: "tests_pass", context: {} },
      { name: "lint_pass", context: {} },
      { name: "start_integration", context: {} },
      { name: "integration_pass", context: {} },
      { name: "deploy_staging", context: {} },
      { name: "staging_deploy_success", context: {} },
      { name: "validate_staging", context: {} },
      { name: "staging_checks_fail", context: {} },
      { name: "redeploy_staging", context: {} },
      { name: "staging_deploy_success", context: {} },
      { name: "validate_staging", context: {} },
      { name: "staging_checks_pass", context: {} },
      { name: "request_approval", context: {} },
      { name: "approve", context: { approver_role: "lead" } },
      { name: "deploy_production", context: {} },
      { name: "prod_deploy_success", context: {} },
      { name: "validate_production", context: {} },
      { name: "prod_checks_pass", context: {} },
    ];
    const result = runHardStateMachine(machine, events);
    const finalOk = result.finalState === "prod_validated" ||
      (Array.isArray(result.finalState) && result.finalState.includes("prod_validated"));
    checks.push(chk("s6:final_state", finalOk, result.finalState, "prod_validated"));
  }

  // Scenario 7: Empty branch guard blocks pipeline
  {
    const events = [
      { name: "trigger_pipeline", context: { branch: "" } },
    ];
    const result = runHardStateMachine(machine, events);
    const finalOk = result.finalState === "idle" ||
      (Array.isArray(result.finalState) && result.finalState.includes("idle"));
    checks.push(chk("s7:final_state", finalOk, result.finalState, "idle"));
    const blocked = result.blockedEvents.find(
      (b) => b.index === 0 && b.event === "trigger_pipeline" && b.reason === "guard_failed"
    );
    checks.push(chk("s7:blocked_event", !!blocked, result.blockedEvents));
  }

  return { pass: checks.every((c) => c.pass), checks };
}

// ---- Lang Schemas ----

const TransitionModel = defineModel({
  name: "Transition",
  description: "A state machine transition from source to target on an event",
  schema: z.object({
    source: z.string(),
    target: z.string(),
    event: z.string(),
    guard: z.string().optional(),
    action: z.string().optional(),
  }),
});

const StateMachineModel = defineModel({
  name: "StateMachine",
  description: "A finite state machine definition",
  schema: z.object({
    name: z.string(),
    initialState: z.string(),
    terminalStates: z.array(z.string()),
    states: z.array(z.string()),
    transitions: z.array(TransitionModel.ref),
  }),
});

const mediumLangSchema = createSchema([StateMachineModel]);

const JoinConditionModel = defineModel({
  name: "JoinCondition",
  description: "A join condition for parallel state machine branches",
  schema: z.object({
    targetState: z.string(),
    requiredStates: z.array(z.string()).describe("All of these states must be reached before the join fires"),
    failState: z.string().describe("State to enter if any required state's failure counterpart is reached"),
    failStates: z.array(z.string()).describe("If any of these states are reached, transition to failState instead"),
  }),
});

const ForkTransitionModel = defineModel({
  name: "ForkTransition",
  description: "A fork transition that splits execution into multiple parallel states",
  schema: z.object({
    source: z.string(),
    targets: z.array(z.string()),
    event: z.string(),
    action: z.string().optional(),
  }),
});

const HardStateMachineModel = defineModel({
  name: "HardStateMachine",
  description: "A finite state machine with parallel fork/join support",
  schema: z.object({
    name: z.string(),
    initialState: z.string(),
    terminalStates: z.array(z.string()),
    states: z.array(z.string()),
    transitions: z.array(TransitionModel.ref),
    joinConditions: z.array(JoinConditionModel.ref).optional(),
    forkTransitions: z.array(ForkTransitionModel.ref).optional(),
  }),
});

const hardLangSchema = createSchema([HardStateMachineModel]);

// ---- Test Cases ----

const case2cMedium: FunctionalTestCase = {
  id: "2c-medium",
  name: "E-Commerce Order State Machine",
  complexity: "medium",
  prompt: mediumPrompt,
  schema: StateMachineSchema,
  langSchema: mediumLangSchema,
  verify: verifyMediumStateMachine,
};

const case2cHard: FunctionalTestCase = {
  id: "2c-hard",
  name: "CI/CD Pipeline State Machine",
  complexity: "hard",
  prompt: hardPrompt,
  schema: HardStateMachineSchema,
  langSchema: hardLangSchema,
  verify: verifyHardStateMachine,
};

export const suite2c: FunctionalTestSuite = {
  id: "2c",
  name: "State Machine",
  cases: [case2cMedium, case2cHard],
};
