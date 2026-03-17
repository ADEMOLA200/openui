# Functional Tests Report

**Run date:** 2026-03-17
**Models:** gpt-5.4, gpt-4o, gpt-5-mini
**Runs per test:** 3

## Summary

| Suite | Test | Complexity | gpt-5.4 JSON | gpt-5.4 LANG | gpt-4o JSON | gpt-4o LANG | gpt-5-mini JSON | gpt-5-mini LANG |
|-------|------|------------|---|---|---|---|---|---|
| Data Transformation | Employee Data Pipeline | medium | 3/3 pass | 3/3 pass | 3/3 pass | 1/3 pass | 3/3 pass | 1/3 pass |
| Data Transformation | Sales Analysis Pipeline | hard | 3/3 pass | 0/3 pass | 3/3 pass | 0/3 pass | 3/3 pass | 0/3 pass |
| API Orchestration | User Loyalty Workflow | medium | 3/3 pass | 0/3 pass | 3/3 pass | 0/3 pass | 3/3 pass | 0/3 pass |
| API Orchestration | Project Health Report Workflow | hard | 3/3 pass | 3/3 pass | 3/3 pass | 0/3 pass | 3/3 pass | 0/3 pass |
| State Machine | E-Commerce Order State Machine | medium | 3/3 pass | 3/3 pass | 3/3 pass | 3/3 pass | 3/3 pass | 2/3 pass |
| State Machine | CI/CD Pipeline State Machine | hard | 3/3 pass | 0/3 pass | 3/3 pass | 3/3 pass | 3/3 pass | 0/3 pass |
| Config Generation | TaskBoard Deployment Config | medium | 3/3 pass | 3/3 pass | 0/3 pass | 0/3 pass | 1/3 pass | 0/3 pass |
| Config Generation | ShopFlow Microservices Config | hard | 0/3 pass | 0/3 pass | 0/3 pass | 0/3 pass | 0/3 pass | 0/3 pass |

## Detailed Results

### Data Transformation — Employee Data Pipeline (medium)

| Model | Format | Run | Parse | row_count | row0:department | row0:employee_count | row0:avg_salary | row0:total_bonus | row1:department | row1:employee_count | row1:avg_salary | row1:total_bonus | row2:department | row2:employee_count | row2:avg_salary | row2:total_bonus | row3:department | row3:employee_count | row3:avg_salary | row3:total_bonus | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1470p 245c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1470p 245c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1470p 245c |
| gpt-5.4 | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1369p 440c |
| gpt-5.4 | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1369p 440c |
| gpt-5.4 | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1369p 438c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1471p 442c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1471p 442c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1471p 442c |
| gpt-4o | lang | 1 | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | 1370p 402c |
| gpt-4o | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1370p 410c |
| gpt-4o | lang | 3 | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | 1370p 400c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1470p 451c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1470p 451c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1470p 451c |
| gpt-5-mini | lang | 1 | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | 1369p 976c |
| gpt-5-mini | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1369p 348c |
| gpt-5-mini | lang | 3 | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | 1369p 400c |

<details><summary>gpt-4o [lang] — failing run 1</summary>

**Error:** Validation errors: TransformParams/groupBy: Invalid input: expected string, received array; TransformStep/params: Invalid input: expected object, received null
**Failed checks:**
- row_count: expected `4`, got `10`
- row0:employee_count: expected `3`, got `undefined`
- row0:avg_salary: expected `120000`, got `undefined`
- row0:total_bonus: expected `42250`, got `undefined`
- row1:department: expected `"Finance"`, got `"Engineering"`
- row1:employee_count: expected `3`, got `undefined`
- row1:avg_salary: expected `106667`, got `undefined`
- row1:total_bonus: expected `31700`, got `undefined`
- row2:department: expected `"Marketing"`, got `"Sales"`
- row2:employee_count: expected `2`, got `undefined`
- row2:avg_salary: expected `94500`, got `undefined`
- row2:total_bonus: expected `18550`, got `undefined`
- row3:employee_count: expected `2`, got `undefined`
- row3:avg_salary: expected `91500`, got `undefined`
- row3:total_bonus: expected `14250`, got `undefined`

```
```
root = Pipeline(steps, outputColumns)

steps = [
    filterActive,
    filterHireDate,
    computeFullName,
    computeAnnualBonus,
    aggregateByDepartment,
    sortByTotalBonus
]

filterActive = TransformStep("filter", filterActiveParams)
filterHireDate = TransformStep("filter", filterHireDateParams)
computeFullName = TransformStep("compute", computeFullNameParams)
computeAnnualBonus = TransformStep("compute", computeAnnualBonusParams)
aggregateByDepartment = TransformStep("aggregate", aggregateByDepartmentParams)
sortByTotalBonus = TransformStep("sort", sortByTotalBonusParams)

filterActiveParams = TransformParams("status", "eq", "active")
filterHireDateParams = TransformParams("hire_date", "before", "2024-01-01")

computeFullNameParams = TransformParams(null, null, null, "full_name", "first_name + ' ' + last_name")

computeAnnualBonusParams = TransformParams(null, null, null, "annual_bonus", null, conditions, "0")

conditions = [
    Condition("performance_rating >= 4.5", "sal
```
</details>

<details><summary>gpt-5-mini [lang] — failing run 1</summary>

**Error:** Validation errors: TransformParams/conditions/0/when: Invalid input: expected string, received undefined; TransformParams/conditions/0/then: Invalid input: expected string, received undefined; TransformParams/conditions/1/when: Invalid input: expected string, received undefined; TransformParams/conditions/1/then: Invalid input: expected string, received undefined; TransformParams/conditions/2/when: Invalid input: expected string, received undefined; TransformParams/conditions/2/then: Invalid input: expected string, received undefined; TransformStep/params: Invalid input: expected object, received null
**Failed checks:**
- row_count: expected `4`, got `10`
- row0:employee_count: expected `3`, got `undefined`
- row0:avg_salary: expected `120000`, got `undefined`
- row0:total_bonus: expected `42250`, got `undefined`
- row1:department: expected `"Finance"`, got `"Engineering"`
- row1:employee_count: expected `3`, got `undefined`
- row1:avg_salary: expected `106667`, got `undefined`
- row1:total_bonus: expected `31700`, got `undefined`
- row2:department: expected `"Marketing"`, got `"Sales"`
- row2:employee_count: expected `2`, got `undefined`
- row2:avg_salary: expected `94500`, got `undefined`
- row2:total_bonus: expected `18550`, got `undefined`
- row3:employee_count: expected `2`, got `undefined`
- row3:avg_salary: expected `91500`, got `undefined`
- row3:total_bonus: expected `14250`, got `undefined`

```
root = Pipeline([step_filter_status, step_filter_hiredate, step_compute_fullname, step_compute_bonus, step_group_dept, step_sort_totalbonus], ["department", "employee_count", "avg_salary", "total_bonus"])
step_filter_status = TransformStep("filter", params_filter_status)
params_filter_status = TransformParams("status", "eq", "active")
step_filter_hiredate = TransformStep("filter", params_filter_hiredate)
params_filter_hiredate = TransformParams("hire_date", "before", "2024-01-01")
step_compute_fullname = TransformStep("compute", params_compute_fullname)
params_compute_fullname = TransformParams(null, null, null, "full_name", "first_name + \" \" + last_name")
step_compute_bonus = TransformStep("compute", params_compute_bonus)
params_compute_bonus = TransformParams(null, null, null, "annual_bonus", "performance_rating >= 4.5 ? salary * 0.15 : performance_rating >= 3.5 ? salary * 0.10 : performance_rating >= 2.5 ? salary * 0.05 : 0")
step_group_dept = TransformStep("aggregate", params_gro
```
</details>

### Data Transformation — Sales Analysis Pipeline (hard)

| Model | Format | Run | Parse | row_count | row0:category | row0:regions_active | row0:combined_revenue | row0:combined_profit | row0:best_region | row0:best_region_revenue | row1:category | row1:regions_active | row1:combined_revenue | row1:combined_profit | row1:best_region | row1:best_region_revenue | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1925p 444c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1925p 444c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1925p 444c |
| gpt-5.4 | lang | 1 | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1824p 735c |
| gpt-5.4 | lang | 2 | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1824p 731c |
| gpt-5.4 | lang | 3 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1824p 731c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1926p 809c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1926p 809c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1926p 809c |
| gpt-4o | lang | 1 | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1825p 683c |
| gpt-4o | lang | 2 | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1825p 707c |
| gpt-4o | lang | 3 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1825p 666c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1925p 867c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1925p 826c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1925p 867c |
| gpt-5-mini | lang | 1 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1824p 1386c |
| gpt-5-mini | lang | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1824p 1330c |
| gpt-5-mini | lang | 3 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 1824p 1672c |

<details><summary>gpt-5.4 [lang] — failing run 1</summary>

**Error:** Validation errors: TransformParams/direction: Invalid option: expected one of "asc"|"desc"; TransformStep/params: Invalid input: expected object, received null
**Failed checks:**
- row_count: expected `2`, got `1`
- row0:category: expected `"Gadgets"`, got `undefined`
- row0:combined_revenue: expected `4086`, got `7186.25`
- row0:combined_profit: expected `2224`, got `0`
- row0:best_region: expected `"North"`, got `"East"`
- row0:best_region_revenue: expected `1732`, got `2653`
- row1:category: expected `"Widgets"`, got `undefined`
- row1:regions_active: expected `3`, got `undefined`
- row1:combined_revenue: expected `2294`, got `undefined`
- row1:combined_profit: expected `1262`, got `undefined`
- row1:best_region: expected `"South"`, got `undefined`
- row1:best_region_revenue: expected `940`, got `undefined`

```
root = Pipeline([step1, step2, step3, step4, step5, step6, step7, step8, step9, step10], ["category", "regions_active", "combined_revenue", "combined_profit", "best_region", "best_region_revenue"])
step1 = TransformStep("join", params1)
step2 = TransformStep("filter", params2)
step3 = TransformStep("filter", params3)
step4 = TransformStep("compute", params4)
step5 = TransformStep("compute", params5)
step6 = TransformStep("compute", params6)
step7 = TransformStep("compute", params7)
step8 = TransformStep("aggregate", params8)
step9 = TransformStep("filter", params9)
step10 = TransformStep("aggregate", params10)
params1 = TransformParams(null, null, null, null, null, null, null, null, null, null, "product_id")
params2 = TransformParams("order_date", "after", "2025-06-30", null, null, null, null, null, null, null, null)
params3 = TransformParams("channel", "neq", "internal", null, null, null, null, null, null, null, null)
params4 = TransformParams(null, null, null, "revenue", "quantity * 
```
</details>

<details><summary>gpt-4o [lang] — failing run 1</summary>

**Error:** Validation errors: TransformParams/direction: Invalid option: expected one of "asc"|"desc"; TransformStep/params: Invalid input: expected object, received null; TransformParams/direction: Invalid option: expected one of "asc"|"desc"; TransformStep/params: Invalid input: expected object, received null
**Failed checks:**
- row_count: expected `2`, got `1`
- row0:category: expected `"Gadgets"`, got `undefined`
- row0:combined_revenue: expected `4086`, got `7186.25`
- row0:combined_profit: expected `2224`, got `0`
- row0:best_region: expected `"North"`, got `"East"`
- row0:best_region_revenue: expected `1732`, got `2653`
- row1:category: expected `"Widgets"`, got `undefined`
- row1:regions_active: expected `3`, got `undefined`
- row1:combined_revenue: expected `2294`, got `undefined`
- row1:combined_profit: expected `1262`, got `undefined`
- row1:best_region: expected `"South"`, got `undefined`
- row1:best_region_revenue: expected `940`, got `undefined`

```
```
root = Pipeline(steps, outputColumns)

steps = [
    joinStep,
    filterDateStep,
    filterChannelStep,
    computeRevenueStep,
    computeCostStep,
    computeProfitStep,
    computeMarginStep,
    firstAggregationStep,
    filterOrderCountStep,
    secondAggregationStep,
    sortStep
]

joinStep = TransformStep("join", joinParams)
joinParams = TransformParams(null, null, null, null, null, null, null, null, null, null, "product_id")

filterDateStep = TransformStep("filter", filterDateParams)
filterDateParams = TransformParams("order_date", "after", "2025-06-30")

filterChannelStep = TransformStep("filter", filterChannelParams)
filterChannelParams = TransformParams("channel", "neq", "internal")

computeRevenueStep = TransformStep("compute", computeRevenueParams)
computeRevenueParams = TransformParams(null, null, null, "revenue", "quantity * unit_price * (1 - discount_percent / 100)")

computeCostStep = TransformStep("compute", computeCostParams)
computeCostParams = TransformParam
```
</details>

<details><summary>gpt-5-mini [lang] — failing run 1</summary>

**Error:** Validation errors: TransformParams/metrics/0: Invalid input: expected object, received string; TransformStep/params: Invalid input: expected object, received null
**Failed checks:**
- row_count: expected `2`, got `1`
- row0:category: expected `"Gadgets"`, got `undefined`
- row0:regions_active: expected `3`, got `1`
- row0:combined_revenue: expected `4086`, got `0`
- row0:combined_profit: expected `2224`, got `0`
- row0:best_region: expected `"North"`, got `undefined`
- row0:best_region_revenue: expected `1732`, got `0`
- row1:category: expected `"Widgets"`, got `undefined`
- row1:regions_active: expected `3`, got `undefined`
- row1:combined_revenue: expected `2294`, got `undefined`
- row1:combined_profit: expected `1262`, got `undefined`
- row1:best_region: expected `"South"`, got `undefined`
- row1:best_region_revenue: expected `940`, got `undefined`

```
root = Pipeline([step_join, step_filter_date, step_filter_channel, step_compute_revenue_cost_profit, step_compute_margin, step_agg_category_region, step_filter_groups, step_agg_category, step_sort], ["category","regions_active","combined_revenue","combined_profit","best_region","best_region_revenue"])
step_join = TransformStep("join", params_join)
params_join = TransformParams(null, null, null, null, null, null, null, null, null, "product_id")
step_filter_date = TransformStep("filter", params_date)
params_date = TransformParams("order_date", "gte", "2025-07-01")
step_filter_channel = TransformStep("filter", params_channel)
params_channel = TransformParams("channel", "neq", "internal")
step_compute_revenue_cost_profit = TransformStep("compute", params_compute_rcp)
params_compute_rcp = TransformParams(null, null, null, null, "quantity * unit_price * (1 - discount_percent / 100)", null, null, null, null, null)
step_compute_margin = TransformStep("compute", params_compute_margin)
params_co
```
</details>

### API Orchestration — User Loyalty Workflow (medium)

| Model | Format | Run | Parse | U2_not_queried | U1_purchases_fetched | U3_purchases_fetched | U4_purchases_fetched | U5_purchases_fetched | D1_fetched | D3_fetched | D2_not_fetched | alice_email_sent | dan_email_sent | carol_email_not_sent | eva_email_not_sent | output_length | alice_in_output | alice_email | alice_dept | alice_purchases | alice_notif | dan_in_output | dan_email | dan_dept | dan_purchases | dan_notif | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 899p 400c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 899p 311c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 899p 370c |
| gpt-5.4 | lang | 1 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1023p 368c |
| gpt-5.4 | lang | 2 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1023p 416c |
| gpt-5.4 | lang | 3 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1023p 372c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 900p 569c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 900p 525c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 900p 576c |
| gpt-4o | lang | 1 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1024p 373c |
| gpt-4o | lang | 2 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1024p 367c |
| gpt-4o | lang | 3 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1024p 338c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 899p 611c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 899p 636c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 899p 642c |
| gpt-5-mini | lang | 1 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1023p 693c |
| gpt-5-mini | lang | 2 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1023p 439c |
| gpt-5-mini | lang | 3 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1023p 479c |

<details><summary>gpt-5.4 [lang] — failing run 1</summary>

**Error:** Validation errors: ApiCall/queryParams/min_amount: Invalid input: expected string, received number

```
root = Workflow([getUsers, getPurchases, getDepartments, sendEmails], output)
getUsers = ApiCall("get_users", "GET", "/api/users", null, null, null, null, null, "$.users[?(@.active==true)]")
getPurchases = ApiCall("get_purchases", "GET", "/api/users/{id}/purchases", {"since":"2025-01-01","min_amount":500}, null, ["get_users"], "$get_users", null, "{\"user_id\": $.id, \"name\": $.name, \"email\": $.email, \"department_id\": $.department_id, \"purchase_count\": count($.response.purchases), \"qualifies\": count($.response.purchases) >= 3}")
getDepartments = ApiCall("get_departments", "GET", "/api/departments/{department_id}", null, null, ["get_purchases"], "$get_purchases[?(@.qualifies==true)]", null, "{\"user_name\": $.name, \"email\": $.email, \"department_id\": $.department_id, \"purchase_count\": $.purchase_count, \"department_name\": $.response.name}")
sendEmails = ApiCall("send_emails", "POST", "/api/notifications/email", null, {"to":"$.email","subject":"Loyalty Reward — $.departmen
```
</details>

<details><summary>gpt-4o [lang] — failing run 1</summary>

**Error:** Validation errors: ApiCall/queryParams/min_amount: Invalid input: expected string, received number; ApiCall/queryParams/min_amount: Invalid input: expected string, received number

```
```plaintext
root = Workflow([fetchUsers, fetchPurchases, filterQualifyingUsers, fetchDepartment, sendEmail], workflowOutput)

fetchUsers = ApiCall("fetchUsers", "GET", "/api/users", null, null, null, null, null, "$.users[?(@.active == true)]")

fetchPurchases = ApiCall("fetchPurchases", "GET", "/api/users/{id}/purchases", {"since": "2025-01-01", "min_amount": 500}, null, ["fetchUsers"], "$.id", null, "$.purchases[?(@.length >= 3)]")

filterQualifyingUsers = ApiCall("filterQualifyingUsers", "GET", "/api/users/{id}/purchases", {"since": "2025-01-01", "min_amount": 500}, null, ["fetchPurchases"], "$.id", null, "$.purchases[?(@.length >= 3)]")

fetchDepartment = ApiCall("fetchDepartment", "GET", "/api/departments/{id}", null, null, ["filterQualifyingUsers"], "$.department_id", null, "$.name")

sendEmail = ApiCall("sendEmail", "POST", "/api/notifications/email", {"to": "$.email", "subject": "Loyalty Reward — {department name}", "body": "Hi {user name}, you have made {purchase count} qualif
```
</details>

<details><summary>gpt-5-mini [lang] — failing run 1</summary>

**Error:** Validation errors: ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string

```
root = Workflow([fetch_users, filter_active_users, for_each_active_user, collect_qualifying_users, fetch_depts_for_qualifiers, send_notifications, assemble_summary], WorkflowOutput("summary"))

fetch_users = ApiCall("fetch_users", "GET", "/api/users", null, null, null, null, null, "$.users")

filter_active_users = ApiCall("filter_active_users", "GET", "/api/users", null, null, "fetch_users", null, "$.users[?(@.active==true)]")

for_each_active_user = ApiCall("for_each_active_user", "GET", "/api/users/{id}/purchases", null, null, "filter_active_users", "$.users", "true", "$.purchases")
 
collect_qualifying_users = ApiCall("collect_qualifying_users", "GET", "/api/users", null, null, "for_each_active_user", null, null)

fetch_depts_for_qualifiers = ApiCall("fetch_depts_for_qualifiers", "GET", "/api/departments/{id}", null, null, "collect_qualifying_users", null, null)

send_notifications = ApiCall("send_notifications", "POST", "/api/notifications/email", null, null, "fetch_depts_for_quali
```
</details>

### API Orchestration — Project Health Report Workflow (hard)

| Model | Format | Run | Parse | PRJ3_no_time_entries | PRJ3_no_risks | PRJ-1_time_entries_fetched | PRJ-1_risks_fetched | PRJ-2_time_entries_fetched | PRJ-2_risks_fetched | PRJ-4_time_entries_fetched | PRJ-4_risks_fetched | report_generated | slack_sent | report_id | report_url | flagged_count | atlas_in_output | atlas_classification | atlas_owner | atlas_utilization | atlas_budget | atlas_open_high_risks | delta_in_output | delta_classification | delta_owner | delta_utilization | delta_budget | delta_open_high_risks | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1394p 1111c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1394p 1094c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1394p 1499c |
| gpt-5.4 | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1518p 2321c |
| gpt-5.4 | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1518p 963c |
| gpt-5.4 | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1518p 1697c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1395p 1313c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1395p 1115c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1395p 1171c |
| gpt-4o | lang | 1 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1519p 575c |
| gpt-4o | lang | 2 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1519p 578c |
| gpt-4o | lang | 3 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1519p 635c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1394p 1024c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1394p 1533c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1394p 1743c |
| gpt-5-mini | lang | 1 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1518p 702c |
| gpt-5-mini | lang | 2 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1518p 647c |
| gpt-5-mini | lang | 3 | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1518p 962c |

<details><summary>gpt-4o [lang] — failing run 1</summary>

**Error:** Validation errors: ApiCall/body/sections: Invalid input: expected string, received array; ApiCall/body/recipients: Invalid input: expected string, received array

```
```
root = Workflow(steps, output)

steps = [
  fetchProjects,
  filterActiveProjects,
  fetchTeamsForProjects,
  fetchTimeEntriesForProjects,
  fetchRisksForProjects,
  computeProjectMetrics,
  classifyProjects,
  fetchOwnerAndLeads,
  generateReport,
  sendSlackNotification
]

fetchProjects = ApiCall("fetchProjects", "GET", "/api/projects", null, null, null, null, "$.projects")

filterActiveProjects = ApiCall("filterActiveProjects", "GET", "/api/projects", null, null, ["fetchProjects"], null, "$[?(@.status=='active')]")

fetchTeamsForProjects = ApiCall("fetchTeamsForProjects", "GET", "/api/teams/{id}", null, null, ["filterActiveProjects"], "$.team_ids", null)

fetchTimeEntriesForProjects = ApiCall("fetchTimeEntriesForProjects", "GET", "/api/projects/{id}/time-entries", {"start_date": "2025-10-01", "end_date": "2025-12-31"}, null, ["filterActiveProjects"], null, null)

fetchRisksForProjects = ApiCall("fetchRisksForProjects", "GET", "/api/projects/{id}/risks", null, null, ["filterActiv
```
</details>

<details><summary>gpt-5-mini [lang] — failing run 1</summary>

**Error:** Validation errors: ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/body/sections: Invalid input: expected string, received array; ApiCall/body/recipients: Invalid input: expected string, received array; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string; ApiCall/dependsOn: Invalid input: expected array, received string

```
root = Workflow([fetch_projects, filter_active_projects, iterate_active_projects, collect_flagged_projects, prepare_report_body, generate_report, notify_slack, output], WorkflowOutput("({\"report_id\": ${generate_report.response.report_id}, \"report_url\": ${generate_report.response.url}, \"flagged_project_count\": ${collect_flagged_projects.flagged_count}, \"flagged_projects\": ${collect_flagged_projects.flagged_summaries}})"))

fetch_projects = ApiCall("fetch_projects", "GET", "/api/projects", null, null, null, null, null, "$.projects")

filter_active_projects = ApiCall("filter_active_projects", "GET", "/api/projects", null, null, "fetch_projects", null, "true", "$.projects[?(@.status==\"active\")]")

iterate_active_projects = ApiCall("iterate_active_projects", "GET", "/api/projects/{id}", null, null, "filter_active_projects", "filter_active_projects.projects", null, "$.projects")
project_loop = iterate_active_projects

fetch_project_teams = ApiCall("fetch_project_teams", "GET", "/ap
```
</details>

### State Machine — E-Commerce Order State Machine (medium)

| Model | Format | Run | Parse | state:draft | state:submitted | state:payment_pending | state:payment_failed | state:confirmed | state:processing | state:shipped | state:delivered | state:cancelled | state:refund_pending | state:refunded | transition:draft->submitted:pl | transition:submitted->payment_ | transition:payment_pending->co | transition:payment_pending->pa | transition:payment_failed->pay | transition:payment_failed->can | transition:confirmed->processi | transition:processing->shipped | transition:shipped->delivered: | transition:delivered->refund_p | transition:refund_pending->ref | transition:refund_pending->del | transition:submitted->cancelle | transition:payment_pending->ca | transition:confirmed->cancelle | s1: final_state | s1: path | s2: final_state | s2: path | s3: final_state | s3: path | s3: blocked_event | s4: final_state | s4: path | s5: final_state | s5: path | s6: final_state | s6: path | s6: blocked_event | s7: final_state | s7: path | s7: blocked_event | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 726p 727c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 726p 741c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 726p 748c |
| gpt-5.4 | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 944p 487c |
| gpt-5.4 | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 944p 497c |
| gpt-5.4 | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 944p 500c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 727p 759c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 727p 759c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 727p 759c |
| gpt-4o | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 945p 473c |
| gpt-4o | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 945p 473c |
| gpt-4o | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 945p 473c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 726p 961c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 726p 945c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 726p 988c |
| gpt-5-mini | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 944p 728c |
| gpt-5-mini | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 944p 578c |
| gpt-5-mini | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 944p 671c |

<details><summary>gpt-5-mini [lang] — failing run 2</summary>

**Failed checks:**
- transition:payment_pending->cancelled:cancel_order: expected `undefined`, got `undefined`

```
root = StateMachine("order_lifecycle", "draft", ["delivered", "cancelled", "refunded"], ["draft", "submitted", "payment_pending", "payment_failed", "confirmed", "processing", "shipped", "delivered", "cancelled", "refund_pending", "refunded"], [t_draft_submitted, t_submitted_payment_pending, t_submitted_cancelled, t_initiate_payment, t_payment_success, t_payment_declined, t_retry_payment, t_payment_failed_cancel, t_confirmed_processing, t_processing_shipped, t_shipped_delivered, t_delivered_refund_pending, t_refund_process, t_refund_deny, t_confirmed_cancel])

t_draft_submitted = Transition("draft", "submitted", "place_order", "items_count > 0", "validate_order_items_and_reserve_inventory")
t_submitted_payment_pending = Transition("submitted", "payment_pending", "initiate_payment", null, "start_payment_flow")
t_initiate_payment = t_submitted_payment_pending
t_payment_success = Transition("payment_pending", "confirmed", "payment_success", null, "capture_payment_and_send_confirmation_emai
```
</details>

### State Machine — CI/CD Pipeline State Machine (hard)

| Model | Format | Run | Parse | state:idle | state:source_checkout | state:checkout_failed | state:build_started | state:unit_tests | state:lint | state:unit_tests_passed | state:unit_tests_failed | state:lint_passed | state:lint_failed | state:build_complete | state:build_failed | state:integration_tests | state:integration_passed | state:integration_failed | state:staging_deploy | state:staging_deployed | state:staging_deploy_failed | state:staging_validation | state:staging_validated | state:staging_validation_faile | state:approval_pending | state:approval_granted | state:approval_rejected | state:prod_deploy | state:prod_deployed | state:prod_deploy_failed | state:prod_validation | state:prod_validated | state:prod_validation_failed | state:rollback_initiated | state:rollback_complete | state:pipeline_aborted | fork:build_started->unit_tests | join:unit_tests_passed+lint_pa | join_fail:build_failed | s1:final_state | s2:final_state | s3:final_state | s4:final_state | s4:blocked_event | s5:final_state | s6:final_state | s7:final_state | s7:blocked_event | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 2405c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 2433c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 2425c |
| gpt-5.4 | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | 1855p 1655c |
| gpt-5.4 | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | 1855p 1607c |
| gpt-5.4 | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | 1855p 1653c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1857p 2031c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1857p 1964c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1857p 1964c |
| gpt-4o | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 1039c |
| gpt-4o | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 1039c |
| gpt-4o | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 1039c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 2405c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 2420c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1856p 2276c |
| gpt-5-mini | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | 1855p 1162c |
| gpt-5-mini | lang | 2 | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | 1855p 1745c |
| gpt-5-mini | lang | 3 | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | 1855p 1711c |

<details><summary>gpt-5.4 [lang] — failing run 1</summary>

**Failed checks:**
- s5:final_state: expected `"pipeline_aborted"`, got `"integration_tests"`

```
root = HardStateMachine("multi_stage_cicd_pipeline", "idle", ["prod_validated", "pipeline_aborted", "rollback_complete"], ["idle", "source_checkout", "checkout_failed", "build_started", "unit_tests", "lint", "unit_tests_passed", "unit_tests_failed", "lint_passed", "lint_failed", "build_complete", "build_failed", "integration_tests", "integration_passed", "integration_failed", "staging_deploy", "staging_deployed", "staging_deploy_failed", "staging_validation", "staging_validated", "staging_validation_failed", "approval_pending", "approval_granted", "approval_rejected", "prod_deploy", "prod_deployed", "prod_deploy_failed", "prod_validation", "prod_validated", "prod_validation_failed", "rollback_initiated", "rollback_complete", "pipeline_aborted"], [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33, t34, t35, t36, t37, t38, t39, t40, t41], [j1], [f1])
t1 = Transition("idle", "source_ch
```
</details>

<details><summary>gpt-5-mini [lang] — failing run 1</summary>

**Failed checks:**
- fork:build_started->unit_tests+lint: expected `undefined`, got `undefined`
- s1:final_state: expected `"prod_validated"`, got `"unit_tests_passed"`
- s2:final_state: expected `"idle"`, got `"unit_tests_passed"`
- s3:final_state: expected `"idle"`, got `"unit_tests_passed"`
- s4:final_state: expected `"approval_pending"`, got `"unit_tests_passed"`
- s4:blocked_event: expected `undefined`, got `[{"index":4,"event":"lint_pass","reason":"no_transition"},{"index":5,"event":"start_integration","reason":"no_transition"},{"index":6,"event":"integration_pass","reason":"no_transition"},{"index":7,"event":"deploy_staging","reason":"no_transition"},{"index":8,"event":"staging_deploy_success","reason":"no_transition"},{"index":9,"event":"validate_staging","reason":"no_transition"},{"index":10,"event":"staging_checks_pass","reason":"no_transition"},{"index":11,"event":"request_approval","reason":"no_transition"},{"index":12,"event":"approve","reason":"no_transition"}]`
- s5:final_state: expected `"pipeline_aborted"`, got `"unit_tests_passed"`
- s6:final_state: expected `"prod_validated"`, got `"unit_tests_passed"`

```
root = HardStateMachine("ci_cd_pipeline", "idle", ["prod_validated", "pipeline_aborted", "rollback_complete"], ["idle","source_checkout","checkout_failed","build_started","unit_tests","lint","unit_tests_passed","unit_tests_failed","lint_passed","lint_failed","build_complete","build_failed","integration_tests","integration_passed","integration_failed","staging_deploy","staging_deployed","staging_deploy_failed","staging_validation","staging_validated","staging_validation_failed","approval_pending","approval_granted","approval_rejected","prod_deploy","prod_deployed","prod_deploy_failed","prod_validation","prod_validated","prod_validation_failed","rollback_initiated","rollback_complete","pipeline_aborted"], transitions_list, join_conditions)

transitions_list = [
Transition("idle","source_checkout","trigger_pipeline","branch != \"\"","action_start_pipeline"),
Transition("source_checkout","build_started","checkout_success",null,"action_log_checkout_success"),
Transition("source_checkout","c
```
</details>

### Config Generation — TaskBoard Deployment Config (medium)

| Model | Format | Run | Parse | appName | services_count | web-frontend:exists | web-frontend:image | web-frontend:replicas | web-frontend:memory | web-frontend:cpu | web-frontend:port | web-frontend:API_URL:exists | web-frontend:API_URL:serviceRe | web-frontend:NODE_ENV | web-frontend:hc:exists | web-frontend:hc:type | web-frontend:hc:path | web-frontend:hc:interval | web-frontend:hc:timeout | web-frontend:hc:failure | web-frontend:expose | api-server:exists | api-server:image | api-server:replicas | api-server:memory | api-server:cpu | api-server:port | api-server:JWT_SECRET | api-server:JWT_SECRET:secretNa | api-server:JWT_SECRET:key | api-server:hc:exists | api-server:hc:type | api-server:hc:interval | api-server:hc:timeout | api-server:hc:failure | api-server:expose | background-worker:exists | background-worker:image | background-worker:replicas | background-worker:memory | background-worker:hc:absent | background-worker:expose | database:exists | database:image | database:replicas | database:memory | database:port | database:POSTGRES_PASSWORD | database:POSTGRES_PASSWORD:sec | database:POSTGRES_PASSWORD:key | database:expose | cache:exists | cache:image | cache:replicas | cache:memory | cache:cpu | cache:port | cache:expose | ingress:domain | ingress:serviceName | ingress:servicePort | ingress:tls | volume:database:exists | volume:database:sizeGb | volume:database:storageClass | netpol:web-frontend:exists | netpol:web-frontend:egress:api | netpol:web-frontend:egress:no- | netpol:web-frontend:egress:no- | netpol:api-server:exists | netpol:api-server:egress:datab | netpol:api-server:egress:cache | netpol:api-server:ingress:web- | netpol:background-worker:exist | netpol:background-worker:egres | netpol:background-worker:egres | netpol:background-worker:ingre | netpol:database:exists | netpol:database:ingress:api-se | netpol:database:ingress:bg-wor | netpol:cache:exists | netpol:cache:ingress:api-serve | netpol:cache:ingress:bg-worker | secret:taskboard-secrets:exist | secret:taskboard-secrets:keys | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2007p 1313c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2007p 726c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2007p 726c |
| gpt-5.4 | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1478p 873c |
| gpt-5.4 | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1478p 827c |
| gpt-5.4 | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 1478p 827c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 2008p 1173c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 2008p 1173c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 2008p 1173c |
| gpt-4o | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 1479p 766c |
| gpt-4o | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 1479p 787c |
| gpt-4o | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 1479p 766c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | — | — | — | — | — | — | — | — | ✗ | — | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 2007p 1448c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2007p 1396c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2007p 1398c |
| gpt-5-mini | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ | 1478p 820c |
| gpt-5-mini | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | ✗ | — | — | ✗ | — | — | ✓ | ✓ | 1478p 891c |
| gpt-5-mini | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | ✗ | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | — | — | — | ✗ | — | — | — | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✓ | 1478p 842c |

<details><summary>gpt-4o [json] — failing run 1</summary>

**Failed checks:**
- netpol:database:exists: expected `undefined`, got `undefined`
- netpol:cache:exists: expected `undefined`, got `undefined`

```
{
  "appName": "TaskBoard",
  "services": [
    {
      "name": "Web Frontend",
      "image": "taskboard/web:3.2.1",
      "replicas": 2,
      "resources": {
        "memoryMb": 512,
        "cpuCores": 0.5
      },
      "ports": [
        {
          "containerPort": 3000,
          "protocol": "TCP"
        }
      ],
      "envVars": [
        {
          "name": "API_URL",
          "serviceRef": "API Server"
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "healthCheck": {
        "type": "http",
        "path": "/health",
        "port": 3000,
        "intervalSeconds": 30,
        "timeoutSeconds": 5,
        "failureThreshold": 3
      },
      "expose": "public"
    },
    {
      "name": "API Server",
      "image": "taskboard/api:3.2.1",
      "replicas": 3,
      "resources": {
        "memoryMb": 1024,
        "cpuCores": 1
      },
      "ports": [
        {
          "containerPort": 8080,
          "protocol"
```
</details>

<details><summary>gpt-4o [lang] — failing run 1</summary>

**Failed checks:**
- netpol:web-frontend:egress:api-server: expected `undefined`, got `undefined`
- netpol:api-server:ingress:web-frontend: expected `undefined`, got `undefined`
- netpol:database:exists: expected `undefined`, got `undefined`
- netpol:cache:exists: expected `undefined`, got `undefined`

```
```
root = DeploymentConfig("TaskBoard", [webFrontend, apiServer, backgroundWorker, database, cache], [webIngress], [databaseVolume], [webToApiPolicy, apiToDbCachePolicy, workerToDbCachePolicy], [taskboardSecrets])

webFrontend = ContainerSpec("web-frontend", "taskboard/web:3.2.1", 2, webResources, [webPort], [webApiUrlEnv, webNodeEnv], webHealthCheck, "public")

apiServer = ContainerSpec("api-server", "taskboard/api:3.2.1", 3, apiResources, [apiPort], [apiDatabaseUrlEnv, apiRedisUrlEnv, apiJwtSecretEnv], apiHealthCheck, "internal")

backgroundWorker = ContainerSpec("background-worker", "taskboard/worker:3.2.1", 2, workerResources, [], [workerDatabaseUrlEnv, workerRedisUrlEnv, workerConcurrencyEnv], null, "none")

database = ContainerSpec("database", "postgres:16", 1, dbResources, [dbPort], [dbNameEnv, dbUserEnv, dbPasswordEnv], null, "internal")

cache = ContainerSpec("cache", "redis:7.2", 1, cacheResources, [cachePort], [], null, "internal")

webResources = Resources(512, 0.5)

apiRe
```
</details>

<details><summary>gpt-5-mini [json] — failing run 1</summary>

**Failed checks:**
- background-worker:expose: expected `"none"`, got `"internal"`
- database:exists: expected `undefined`, got `undefined`
- cache:exists: expected `undefined`, got `undefined`
- volume:database:exists: expected `undefined`, got `undefined`
- netpol:api-server:egress:database: expected `undefined`, got `undefined`
- netpol:api-server:egress:cache: expected `undefined`, got `undefined`
- netpol:background-worker:egress:database: expected `undefined`, got `undefined`
- netpol:background-worker:egress:cache: expected `undefined`, got `undefined`
- netpol:database:exists: expected `undefined`, got `undefined`
- netpol:cache:exists: expected `undefined`, got `undefined`

```
{
  "appName": "TaskBoard",
  "services": [
    {
      "name": "web-frontend",
      "image": "taskboard/web:3.2.1",
      "replicas": 2,
      "resources": {
        "memoryMb": 512,
        "cpuCores": 0.5
      },
      "ports": [
        {
          "containerPort": 3000,
          "protocol": "TCP"
        }
      ],
      "envVars": [
        {
          "name": "API_URL",
          "serviceRef": "http://api-server:8080"
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "healthCheck": {
        "type": "http",
        "path": "/health",
        "port": 3000,
        "intervalSeconds": 30,
        "timeoutSeconds": 5,
        "failureThreshold": 3
      },
      "expose": "public"
    },
    {
      "name": "api-server",
      "image": "taskboard/api:3.2.1",
      "replicas": 3,
      "resources": {
        "memoryMb": 1024,
        "cpuCores": 1
      },
      "ports": [
        {
          "containerPort": 8080,
        
```
</details>

<details><summary>gpt-5-mini [lang] — failing run 1</summary>

**Failed checks:**
- background-worker:exists: expected `undefined`, got `undefined`
- netpol:web-frontend:egress:api-server: expected `undefined`, got `undefined`
- netpol:background-worker:exists: expected `undefined`, got `undefined`
- netpol:database:ingress:bg-worker: expected `undefined`, got `undefined`
- netpol:cache:ingress:bg-worker: expected `undefined`, got `undefined`

```
root = DeploymentConfig("TaskBoard", [webFrontend, apiServer, worker, database, cache], [webIngress], [dbVolume], [webNetworkPolicy, apiNetworkPolicy, workerNetworkPolicy, dbNetworkPolicy, cacheNetworkPolicy], [taskboardSecrets])
webFrontend = ContainerSpec("web-frontend", "taskboard/web:3.2.1", 2, webResources, [webPort], [webApiUrlEnv, webNodeEnv], webHealth, "public")
webResources = Resources(512, 0.5)
webPort = Port(3000, "TCP")
webApiUrlEnv = EnvVar("API_URL", null, null, "api-server")
webNodeEnv = EnvVar("NODE_ENV", "production", null, null)
webHealth = HealthCheck("http", "/health", 3000, 30, 5, 3)
apiServer = ContainerSpec("api-server", "taskboard/api:3.2.1", 3, apiResources, [apiPort], [apiDatabaseUrlEnv, apiRedisUrlEnv, apiJwtEnv], apiHealth, "internal")
apiResources = Resources(1024, 1)
apiPort = Port(8080, "TCP")
apiDatabaseUrlEnv = EnvVar("DATABASE_URL", null, null, "database")
apiRedisUrlEnv = EnvVar("REDIS_URL", null, null, "cache")
apiJwtEnv = EnvVar("JWT_SECRET", null,
```
</details>

### Config Generation — ShopFlow Microservices Config (hard)

| Model | Format | Run | Parse | services_count | api-gateway:exists | api-gateway:autoscaling:exists | api-gateway:autoscaling:min | api-gateway:autoscaling:max | api-gateway:autoscaling:target | api-gateway:expose | api-gateway:image | order-service:exists | order-service:autoscaling:exis | order-service:autoscaling:min | order-service:autoscaling:max | order-service:autoscaling:targ | catalog-service:exists | catalog-service:autoscaling:ex | catalog-service:autoscaling:mi | catalog-service:autoscaling:ma | catalog-service:autoscaling:ta | auth-service:no_autoscaling | inventory-service:no_autoscali | notification-service:no_autosc | event-bus:no_autoscaling | auth-db:no_autoscaling | catalog-db:no_autoscaling | order-db:no_autoscaling | inventory-db:no_autoscaling | session-cache:no_autoscaling | search-engine:no_autoscaling | event-bus:exists | event-bus:port:4222 | event-bus:port:6222 | event-bus:hc:tcp | event-bus:expose | secrets_count | secret:auth-keys:exists | secret:auth-keys:keys | secret:payment-config:exists | secret:payment-config:keys | secret:email-config:exists | secret:email-config:keys | secret:sms-config:exists | secret:sms-config:keys | secret:db-passwords:exists | secret:db-passwords:keys | volumes_count | volume:event-bus:exists | volume:event-bus:sizeGb | volume:event-bus:storageClass | volume:auth-db:exists | volume:auth-db:sizeGb | volume:auth-db:storageClass | volume:catalog-db:exists | volume:catalog-db:sizeGb | volume:catalog-db:storageClass | volume:order-db:exists | volume:order-db:sizeGb | volume:order-db:storageClass | volume:inventory-db:exists | volume:inventory-db:sizeGb | volume:inventory-db:storageCla | volume:search-engine:exists | volume:search-engine:sizeGb | volume:search-engine:storageCl | ingress_count | ingress:shop.example.com:exist | ingress:shop.example.com:servi | ingress:shop.example.com:port | ingress:shop.example.com:tls | ingress:api.shop.example.com:e | ingress:api.shop.example.com:s | ingress:api.shop.example.com:p | ingress:api.shop.example.com:t | cross_ref_integrity | secret_ref_integrity | Tokens |
|-------|--------|-----|-------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|--------|
| gpt-5.4 | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3339p 2545c |
| gpt-5.4 | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3339p 2545c |
| gpt-5.4 | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3339p 2545c |
| gpt-5.4 | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2793p 3407c |
| gpt-5.4 | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2793p 3389c |
| gpt-5.4 | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2793p 3405c |
| gpt-4o | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3340p 4408c |
| gpt-4o | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3340p 4408c |
| gpt-4o | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3340p 4408c |
| gpt-4o | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2794p 3120c |
| gpt-4o | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2794p 2339c |
| gpt-4o | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | ✓ | ✓ | 2794p 2307c |
| gpt-5-mini | json | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3339p 4754c |
| gpt-5-mini | json | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3339p 4753c |
| gpt-5-mini | json | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 3339p 4714c |
| gpt-5-mini | lang | 1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2793p 3148c |
| gpt-5-mini | lang | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2793p 2448c |
| gpt-5-mini | lang | 3 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 2793p 3004c |

<details><summary>gpt-5.4 [json] — failing run 1</summary>

**Failed checks:**
- volumes_count: expected `7`, got `6`

```
{"appName":"ShopFlow","services":[{"name":"api-gateway","image":"shopflow/gateway:2.0.4","replicas":3,"resources":{"memoryMb":1024,"cpuCores":1},"ports":[{"containerPort":8443,"protocol":"TCP","name":"https"}],"envVars":[{"name":"RATE_LIMIT_RPS","value":"100"},{"name":"AUTH_SERVICE_URL","serviceRef":"auth-service"},{"name":"CATALOG_SERVICE_URL","serviceRef":"catalog-service"},{"name":"ORDER_SERVICE_URL","serviceRef":"order-service"},{"name":"LOG_LEVEL","value":"info"}],"healthCheck":{"type":"http","path":"/gateway/health","port":8443,"intervalSeconds":10,"timeoutSeconds":3,"failureThreshold":2},"expose":"public","autoscaling":{"minReplicas":3,"maxReplicas":10,"targetCpuPercent":65}},{"name":"auth-service","image":"shopflow/auth:2.0.4","replicas":2,"resources":{"memoryMb":512,"cpuCores":0.5},"ports":[{"containerPort":8081,"protocol":"TCP","name":"http"}],"envVars":[{"name":"DATABASE_URL","serviceRef":"auth-db"},{"name":"JWT_PRIVATE_KEY","valueFrom":{"secretName":"auth-keys","key":"priva
```
</details>

<details><summary>gpt-5.4 [lang] — failing run 1</summary>

**Failed checks:**
- volumes_count: expected `7`, got `6`

```
root = HardDeploymentConfig("ShopFlow", [apiGatewayService, authService, catalogService, orderService, inventoryService, notificationService, eventBusService, authDbService, catalogDbService, orderDbService, inventoryDbService, sessionCacheService, searchEngineService], [shopIngress, apiIngress], [eventBusVolume, authDbVolume, catalogDbVolume, orderDbVolume, inventoryDbVolume, searchEngineVolume], [apiGatewayPolicy, authServicePolicy, catalogServicePolicy, orderServicePolicy, inventoryServicePolicy, notificationServicePolicy, eventBusPolicy, authDbPolicy, catalogDbPolicy, orderDbPolicy, inventoryDbPolicy, sessionCachePolicy, searchEnginePolicy], [authKeysSecret, paymentConfigSecret, emailConfigSecret, smsConfigSecret, dbPasswordsSecret])
apiGatewayService = ContainerSpecHard("api-gateway", "shopflow/gateway:2.0.4", 3, apiGatewayResources, [apiGatewayPort], [gatewayRateLimitEnv, gatewayAuthUrlEnv, gatewayCatalogUrlEnv, gatewayOrderUrlEnv, gatewayLogLevelEnv], apiGatewayHealth, "public",
```
</details>

<details><summary>gpt-4o [json] — failing run 1</summary>

**Failed checks:**
- volumes_count: expected `7`, got `6`

```
{
  "appName": "ShopFlow",
  "services": [
    {
      "name": "api-gateway",
      "image": "shopflow/gateway:2.0.4",
      "replicas": 3,
      "resources": {
        "memoryMb": 1024,
        "cpuCores": 1
      },
      "ports": [
        {
          "containerPort": 8443,
          "protocol": "TCP",
          "name": "https"
        }
      ],
      "envVars": [
        {
          "name": "RATE_LIMIT_RPS",
          "value": "100"
        },
        {
          "name": "AUTH_SERVICE_URL",
          "serviceRef": "auth-service"
        },
        {
          "name": "CATALOG_SERVICE_URL",
          "serviceRef": "catalog-service"
        },
        {
          "name": "ORDER_SERVICE_URL",
          "serviceRef": "order-service"
        },
        {
          "name": "LOG_LEVEL",
          "value": "info"
        }
      ],
      "healthCheck": {
        "type": "http",
        "path": "/gateway/health",
        "port": 8443,
        "intervalSeconds": 10,
        "timeoutSeconds"
```
</details>

<details><summary>gpt-4o [lang] — failing run 1</summary>

**Failed checks:**
- volumes_count: expected `7`, got `6`

```
```
root = HardDeploymentConfig("ShopFlow", [apiGateway, authService, catalogService, orderService, inventoryService, notificationService, eventBus, authDatabase, catalogDatabase, orderDatabase, inventoryDatabase, sessionCache, searchEngine], [apiGatewayIngress1, apiGatewayIngress2], [eventBusVolume, authDbVolume, catalogDbVolume, orderDbVolume, inventoryDbVolume, searchEngineVolume], [apiGatewayNetworkPolicy, authServiceNetworkPolicy, catalogServiceNetworkPolicy, orderServiceNetworkPolicy, inventoryServiceNetworkPolicy, notificationServiceNetworkPolicy, eventBusNetworkPolicy, authDbNetworkPolicy, catalogDbNetworkPolicy, orderDbNetworkPolicy, inventoryDbNetworkPolicy, sessionCacheNetworkPolicy, searchEngineNetworkPolicy], [authKeysSecret, paymentConfigSecret, emailConfigSecret, smsConfigSecret, dbPasswordsSecret])

apiGateway = ContainerSpecHard("api-gateway", "shopflow/gateway:2.0.4", 3, apiGatewayResources, [apiGatewayPort], [rateLimitEnvVar, authServiceUrlEnvVar, catalogServiceUrlEn
```
</details>

<details><summary>gpt-5-mini [json] — failing run 1</summary>

**Failed checks:**
- volumes_count: expected `7`, got `6`

```
{
  "appName": "ShopFlow",
  "services": [
    {
      "name": "api-gateway",
      "image": "shopflow/gateway:2.0.4",
      "replicas": 3,
      "resources": {
        "memoryMb": 1024,
        "cpuCores": 1
      },
      "ports": [
        {
          "containerPort": 8443,
          "protocol": "TCP",
          "name": "https"
        }
      ],
      "envVars": [
        {
          "name": "RATE_LIMIT_RPS",
          "value": "100"
        },
        {
          "name": "AUTH_SERVICE_URL",
          "serviceRef": "auth-service"
        },
        {
          "name": "CATALOG_SERVICE_URL",
          "serviceRef": "catalog-service"
        },
        {
          "name": "ORDER_SERVICE_URL",
          "serviceRef": "order-service"
        },
        {
          "name": "LOG_LEVEL",
          "value": "info"
        }
      ],
      "healthCheck": {
        "type": "http",
        "path": "/gateway/health",
        "port": 8443,
        "intervalSeconds": 10,
        "timeoutSeconds"
```
</details>

<details><summary>gpt-5-mini [lang] — failing run 1</summary>

**Failed checks:**
- volumes_count: expected `7`, got `6`

```
root = HardDeploymentConfig("ShopFlow", [api_gateway, auth_service, catalog_service, order_service, inventory_service, notification_service, event_bus, auth_db, catalog_db, order_db, inventory_db, session_cache, search_engine], [ingress_gateway_shop, ingress_gateway_api], [pv_eventbus, pv_auth_db, pv_catalog_db, pv_order_db, pv_inventory_db, pv_search_engine], [np_api_gateway, np_auth_service, np_catalog_service, np_order_service, np_inventory_service, np_notification_service, np_event_bus, np_auth_db, np_catalog_db, np_order_db, np_inventory_db, np_session_cache, np_search_engine], [secret_auth_keys, secret_payment_config, secret_email_config, secret_sms_config, secret_db_passwords])
api_gateway = ContainerSpecHard("api-gateway", "shopflow/gateway:2.0.4", 3, Resources(1024, 1), [port_gateway], [env_rate_limit, env_auth_url, env_catalog_url, env_order_url, env_log_level], HealthCheck("http", "/gateway/health", 8443, 10, 3, 2), "public", Autoscaling(3, 10, 65))
port_gateway = PortHard(8
```
</details>
