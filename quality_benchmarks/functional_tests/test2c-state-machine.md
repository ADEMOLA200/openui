# Test 2C: State Machine Generation

## Domain: State Machines
## Execution: State machine runner that takes generated states/transitions and processes event sequences

---

## Test Case 1: Medium Complexity

### Problem Description (given to the model)

```
Generate a state machine for an e-commerce order lifecycle with the following requirements:

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
- action to execute (a descriptive string, e.g., "send_confirmation_email", "charge_payment", "release_inventory")
```

### Schema

```typescript
const Transition = z.object({
  source: z.string(),
  target: z.string(),
  event: z.string(),
  guard: z.string().optional().describe("Boolean expression as string; transition only fires if true"),
  action: z.string().optional().describe("Action to execute on transition"),
});

const StateMachineSchema = z.object({
  name: z.string(),
  initialState: z.string(),
  terminalStates: z.array(z.string()),
  states: z.array(z.string()),
  transitions: z.array(Transition),
});
```

### Test Scenarios

Run the generated state machine through these event sequences and verify the final state and transition path:

**Scenario 1: Happy path**
```json
{
  "events": [
    { "name": "place_order", "context": { "items_count": 3 } },
    { "name": "initiate_payment", "context": {} },
    { "name": "payment_success", "context": {} },
    { "name": "start_processing", "context": {} },
    { "name": "ship_order", "context": { "tracking_number": "TRK-12345" } },
    { "name": "confirm_delivery", "context": {} }
  ],
  "expected_final_state": "delivered",
  "expected_path": ["draft", "submitted", "payment_pending", "confirmed", "processing", "shipped", "delivered"]
}
```

**Scenario 2: Payment retry then success**
```json
{
  "events": [
    { "name": "place_order", "context": { "items_count": 1 } },
    { "name": "initiate_payment", "context": {} },
    { "name": "payment_declined", "context": {} },
    { "name": "retry_payment", "context": { "retry_count": 1 } },
    { "name": "payment_success", "context": {} },
    { "name": "start_processing", "context": {} },
    { "name": "ship_order", "context": { "tracking_number": "TRK-99999" } },
    { "name": "confirm_delivery", "context": {} }
  ],
  "expected_final_state": "delivered",
  "expected_path": ["draft", "submitted", "payment_pending", "payment_failed", "payment_pending", "confirmed", "processing", "shipped", "delivered"]
}
```

**Scenario 3: Payment fails, max retries exceeded, cancel**
```json
{
  "events": [
    { "name": "place_order", "context": { "items_count": 2 } },
    { "name": "initiate_payment", "context": {} },
    { "name": "payment_declined", "context": {} },
    { "name": "retry_payment", "context": { "retry_count": 3 } },
    { "name": "cancel_order", "context": {} }
  ],
  "expected_final_state": "cancelled",
  "expected_path": ["draft", "submitted", "payment_pending", "payment_failed", "cancelled"],
  "expected_blocked_event": { "index": 3, "event": "retry_payment", "reason": "guard_failed" }
}
```

**Scenario 4: Cancel after confirmation**
```json
{
  "events": [
    { "name": "place_order", "context": { "items_count": 5 } },
    { "name": "initiate_payment", "context": {} },
    { "name": "payment_success", "context": {} },
    { "name": "cancel_order", "context": {} }
  ],
  "expected_final_state": "cancelled",
  "expected_path": ["draft", "submitted", "payment_pending", "confirmed", "cancelled"]
}
```

**Scenario 5: Deliver then refund**
```json
{
  "events": [
    { "name": "place_order", "context": { "items_count": 1 } },
    { "name": "initiate_payment", "context": {} },
    { "name": "payment_success", "context": {} },
    { "name": "start_processing", "context": {} },
    { "name": "ship_order", "context": { "tracking_number": "TRK-55555" } },
    { "name": "confirm_delivery", "context": {} },
    { "name": "request_refund", "context": { "days_since_delivery": 15 } },
    { "name": "process_refund", "context": {} }
  ],
  "expected_final_state": "refunded",
  "expected_path": ["draft", "submitted", "payment_pending", "confirmed", "processing", "shipped", "delivered", "refund_pending", "refunded"]
}
```

**Scenario 6: Refund denied due to time limit**
```json
{
  "events": [
    { "name": "place_order", "context": { "items_count": 1 } },
    { "name": "initiate_payment", "context": {} },
    { "name": "payment_success", "context": {} },
    { "name": "start_processing", "context": {} },
    { "name": "ship_order", "context": { "tracking_number": "TRK-77777" } },
    { "name": "confirm_delivery", "context": {} },
    { "name": "request_refund", "context": { "days_since_delivery": 45 } }
  ],
  "expected_final_state": "delivered",
  "expected_path": ["draft", "submitted", "payment_pending", "confirmed", "processing", "shipped", "delivered"],
  "expected_blocked_event": { "index": 6, "event": "request_refund", "reason": "guard_failed" }
}
```

**Scenario 7: Empty cart guard**
```json
{
  "events": [
    { "name": "place_order", "context": { "items_count": 0 } }
  ],
  "expected_final_state": "draft",
  "expected_path": ["draft"],
  "expected_blocked_event": { "index": 0, "event": "place_order", "reason": "guard_failed" }
}
```

### Verification

1. Parse the generated state machine
2. Verify all 11 states are present
3. Verify all transitions are present with correct source, target, event, and guard
4. Run all 7 scenarios through the machine
5. For each scenario: check final state, full transition path, and blocked events match

---

## Test Case 2: Hard Complexity

### Problem Description (given to the model)

```
Generate a state machine for a multi-stage CI/CD pipeline with parallel execution, approval gates, and rollback capabilities.

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

IMPORTANT: The parallel fork (build_started → unit_tests + lint) and join (unit_tests_passed + lint_passed → build_complete) require special handling. Represent the fork as two transitions from build_started, and the join as a state that requires both conditions. The schema supports a "join_condition" field for this.
```

### Schema

```typescript
const Transition = z.object({
  source: z.string(),
  target: z.string(),
  event: z.string(),
  guard: z.string().optional(),
  action: z.string().optional(),
});

const JoinCondition = z.object({
  targetState: z.string(),
  requiredStates: z.array(z.string()).describe("All of these states must be reached before the join fires"),
  failState: z.string().describe("State to enter if any required state's failure counterpart is reached"),
  failStates: z.array(z.string()).describe("If any of these states are reached, transition to failState instead"),
});

const StateMachineSchema = z.object({
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
```

### Test Scenarios

**Scenario 1: Full happy path**
```json
{
  "events": [
    { "name": "trigger_pipeline", "context": { "branch": "main" } },
    { "name": "checkout_success", "context": {} },
    { "name": "start_parallel_build", "context": {} },
    { "name": "tests_pass", "context": {} },
    { "name": "lint_pass", "context": {} },
    { "name": "start_integration", "context": {} },
    { "name": "integration_pass", "context": {} },
    { "name": "deploy_staging", "context": {} },
    { "name": "staging_deploy_success", "context": {} },
    { "name": "validate_staging", "context": {} },
    { "name": "staging_checks_pass", "context": {} },
    { "name": "request_approval", "context": {} },
    { "name": "approve", "context": { "approver_role": "lead" } },
    { "name": "deploy_production", "context": {} },
    { "name": "prod_deploy_success", "context": {} },
    { "name": "validate_production", "context": {} },
    { "name": "prod_checks_pass", "context": {} }
  ],
  "expected_final_state": "prod_validated",
  "expected_path": ["idle", "source_checkout", "build_started", ["unit_tests", "lint"], ["unit_tests_passed", "lint_passed"], "build_complete", "integration_tests", "integration_passed", "staging_deploy", "staging_deployed", "staging_validation", "staging_validated", "approval_pending", "approval_granted", "prod_deploy", "prod_deployed", "prod_validation", "prod_validated"]
}
```

**Scenario 2: Lint fails, pipeline resets**
```json
{
  "events": [
    { "name": "trigger_pipeline", "context": { "branch": "feature-x" } },
    { "name": "checkout_success", "context": {} },
    { "name": "start_parallel_build", "context": {} },
    { "name": "tests_pass", "context": {} },
    { "name": "lint_fail", "context": {} },
    { "name": "reset_pipeline", "context": {} }
  ],
  "expected_final_state": "idle",
  "expected_path": ["idle", "source_checkout", "build_started", ["unit_tests", "lint"], "build_failed", "idle"],
  "notes": "Even though unit_tests passed, lint_fail triggers build_failed via the join's fail condition"
}
```

**Scenario 3: Production deploy fails, rollback**
```json
{
  "events": [
    { "name": "trigger_pipeline", "context": { "branch": "main" } },
    { "name": "checkout_success", "context": {} },
    { "name": "start_parallel_build", "context": {} },
    { "name": "tests_pass", "context": {} },
    { "name": "lint_pass", "context": {} },
    { "name": "start_integration", "context": {} },
    { "name": "integration_pass", "context": {} },
    { "name": "deploy_staging", "context": {} },
    { "name": "staging_deploy_success", "context": {} },
    { "name": "validate_staging", "context": {} },
    { "name": "staging_checks_pass", "context": {} },
    { "name": "request_approval", "context": {} },
    { "name": "approve", "context": { "approver_role": "admin" } },
    { "name": "deploy_production", "context": {} },
    { "name": "prod_deploy_error", "context": {} },
    { "name": "initiate_rollback", "context": {} },
    { "name": "rollback_success", "context": {} },
    { "name": "reset_pipeline", "context": {} }
  ],
  "expected_final_state": "idle",
  "expected_path": ["idle", "source_checkout", "build_started", ["unit_tests", "lint"], ["unit_tests_passed", "lint_passed"], "build_complete", "integration_tests", "integration_passed", "staging_deploy", "staging_deployed", "staging_validation", "staging_validated", "approval_pending", "approval_granted", "prod_deploy", "prod_deploy_failed", "rollback_initiated", "rollback_complete", "idle"]
}
```

**Scenario 4: Approval rejected by wrong role**
```json
{
  "events": [
    { "name": "trigger_pipeline", "context": { "branch": "main" } },
    { "name": "checkout_success", "context": {} },
    { "name": "start_parallel_build", "context": {} },
    { "name": "tests_pass", "context": {} },
    { "name": "lint_pass", "context": {} },
    { "name": "start_integration", "context": {} },
    { "name": "integration_pass", "context": {} },
    { "name": "deploy_staging", "context": {} },
    { "name": "staging_deploy_success", "context": {} },
    { "name": "validate_staging", "context": {} },
    { "name": "staging_checks_pass", "context": {} },
    { "name": "request_approval", "context": {} },
    { "name": "approve", "context": { "approver_role": "developer" } }
  ],
  "expected_final_state": "approval_pending",
  "expected_blocked_event": { "index": 12, "event": "approve", "reason": "guard_failed" }
}
```

**Scenario 5: Abort during integration tests**
```json
{
  "events": [
    { "name": "trigger_pipeline", "context": { "branch": "main" } },
    { "name": "checkout_success", "context": {} },
    { "name": "start_parallel_build", "context": {} },
    { "name": "tests_pass", "context": {} },
    { "name": "lint_pass", "context": {} },
    { "name": "start_integration", "context": {} },
    { "name": "abort", "context": {} }
  ],
  "expected_final_state": "pipeline_aborted",
  "expected_path": ["idle", "source_checkout", "build_started", ["unit_tests", "lint"], ["unit_tests_passed", "lint_passed"], "build_complete", "integration_tests", "pipeline_aborted"]
}
```

**Scenario 6: Staging validation fails, redeploy, then succeed**
```json
{
  "events": [
    { "name": "trigger_pipeline", "context": { "branch": "main" } },
    { "name": "checkout_success", "context": {} },
    { "name": "start_parallel_build", "context": {} },
    { "name": "tests_pass", "context": {} },
    { "name": "lint_pass", "context": {} },
    { "name": "start_integration", "context": {} },
    { "name": "integration_pass", "context": {} },
    { "name": "deploy_staging", "context": {} },
    { "name": "staging_deploy_success", "context": {} },
    { "name": "validate_staging", "context": {} },
    { "name": "staging_checks_fail", "context": {} },
    { "name": "redeploy_staging", "context": {} },
    { "name": "staging_deploy_success", "context": {} },
    { "name": "validate_staging", "context": {} },
    { "name": "staging_checks_pass", "context": {} },
    { "name": "request_approval", "context": {} },
    { "name": "approve", "context": { "approver_role": "lead" } },
    { "name": "deploy_production", "context": {} },
    { "name": "prod_deploy_success", "context": {} },
    { "name": "validate_production", "context": {} },
    { "name": "prod_checks_pass", "context": {} }
  ],
  "expected_final_state": "prod_validated"
}
```

**Scenario 7: Empty branch guard blocks pipeline**
```json
{
  "events": [
    { "name": "trigger_pipeline", "context": { "branch": "" } }
  ],
  "expected_final_state": "idle",
  "expected_blocked_event": { "index": 0, "event": "trigger_pipeline", "reason": "guard_failed" }
}
```

### Verification

1. Parse the generated state machine
2. Verify all 30 states are present
3. Verify all transitions including guards and abort rules
4. Verify fork representation (build_started → unit_tests + lint)
5. Verify join condition (unit_tests_passed + lint_passed → build_complete; unit_tests_failed OR lint_failed → build_failed)
6. Run all 7 scenarios through the machine
7. For each scenario: check final state, transition path, and blocked events
