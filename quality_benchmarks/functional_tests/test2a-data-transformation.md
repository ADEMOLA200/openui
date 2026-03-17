# Test 2A: Data Transformation Pipelines

## Domain: Data Transformation
## Execution: TypeScript pipeline runner processes input data through generated steps

---

## Test Case 1: Medium Complexity

### Problem Description (given to the model)

```
You have a CSV dataset of employee records. Generate a data transformation pipeline that produces the following output:

Input columns: employee_id, first_name, last_name, department, hire_date, salary, status, performance_rating

Requirements:
1. Filter to only active employees (status = "active")
2. Filter to only employees hired before 2024-01-01
3. Create a new column "full_name" by concatenating first_name and last_name with a space
4. Create a new column "annual_bonus" calculated as:
   - If performance_rating >= 4.5: salary * 0.15
   - If performance_rating >= 3.5: salary * 0.10
   - If performance_rating >= 2.5: salary * 0.05
   - Otherwise: 0
5. Group by department and compute:
   - employee_count: number of employees in group
   - avg_salary: mean salary rounded to nearest integer
   - total_bonus: sum of annual_bonus rounded to nearest integer
6. Sort by total_bonus descending
7. Output columns: department, employee_count, avg_salary, total_bonus
```

### Input Data

```csv
employee_id,first_name,last_name,department,hire_date,salary,status,performance_rating
E001,Alice,Chen,Engineering,2022-03-15,125000,active,4.7
E002,Bob,Martinez,Engineering,2023-06-01,115000,active,3.8
E003,Carol,Johnson,Engineering,2024-05-20,105000,active,4.2
E004,David,Kim,Sales,2021-01-10,95000,active,4.6
E005,Eva,Patel,Sales,2023-08-22,88000,active,2.3
E006,Frank,O'Brien,Sales,2022-11-03,92000,inactive,4.1
E007,Grace,Liu,Marketing,2020-07-14,98000,active,3.2
E008,Hector,Ruiz,Marketing,2023-02-28,91000,active,4.8
E009,Irene,Novak,Finance,2019-12-01,110000,active,3.9
E010,James,Wright,Finance,2023-09-15,102000,active,4.5
E011,Karen,Bell,Finance,2021-06-30,108000,active,2.8
E012,Leo,Santos,Engineering,2022-08-17,120000,active,3.6
```

### Schema

```typescript
const TransformStep = z.object({
  operation: z.enum(["filter", "compute", "aggregate", "sort"]),
  params: z.object({
    // filter
    column: z.string().optional(),
    operator: z.enum(["eq", "neq", "gt", "gte", "lt", "lte", "before", "after"]).optional(),
    value: z.union([z.string(), z.number()]).optional(),
    // compute
    newColumn: z.string().optional(),
    expression: z.string().optional().describe("JavaScript-like expression using column names as variables"),
    conditions: z.array(
      z.object({
        when: z.string().describe("Boolean expression using column names"),
        then: z.string().describe("Value expression using column names"),
      })
    ).optional(),
    otherwise: z.string().optional().describe("Default value expression if no condition matches"),
    // aggregate
    groupBy: z.string().optional(),
    metrics: z.array(
      z.object({
        name: z.string(),
        function: z.enum(["count", "sum", "avg", "min", "max"]),
        column: z.string().optional().describe("Column to aggregate; not needed for count"),
        round: z.number().optional().describe("Decimal places to round to"),
      })
    ).optional(),
    // sort
    sortBy: z.string().optional(),
    direction: z.enum(["asc", "desc"]).optional(),
  }),
});

const PipelineSchema = z.object({
  steps: z.array(TransformStep),
  outputColumns: z.array(z.string()),
});
```

### Expected Output Data

After applying the correct pipeline to the input:

Step 1 — Filter status = "active": removes E006 (Frank, inactive). 11 rows remain.
Step 2 — Filter hire_date before 2024-01-01: removes E003 (Carol, hired 2024-05-20). 10 rows remain.
Step 3 — Compute full_name: concatenation (not needed for final output but part of pipeline).
Step 4 — Compute annual_bonus:
  - E001 Alice Chen: 125000 * 0.15 = 18750 (rating 4.7 >= 4.5)
  - E002 Bob Martinez: 115000 * 0.10 = 11500 (rating 3.8 >= 3.5)
  - E004 David Kim: 95000 * 0.15 = 14250 (rating 4.6 >= 4.5)
  - E005 Eva Patel: 0 (rating 2.3 < 2.5)
  - E007 Grace Liu: 98000 * 0.05 = 4900 (rating 3.2 >= 2.5)
  - E008 Hector Ruiz: 91000 * 0.15 = 13650 (rating 4.8 >= 4.5)
  - E009 Irene Novak: 110000 * 0.10 = 11000 (rating 3.9 >= 3.5)
  - E010 James Wright: 102000 * 0.15 = 15300 (rating 4.5 >= 4.5)
  - E011 Karen Bell: 108000 * 0.05 = 5400 (rating 2.8 >= 2.5)
  - E012 Leo Santos: 120000 * 0.10 = 12000 (rating 3.6 >= 3.5)
Step 5 — Group by department:
  - Engineering: E001, E002, E012 → count=3, avg_salary=round((125000+115000+120000)/3)=120000, total_bonus=round(18750+11500+12000)=42250
  - Sales: E004, E005 → count=2, avg_salary=round((95000+88000)/2)=91500, total_bonus=round(14250+0)=14250
  - Marketing: E007, E008 → count=2, avg_salary=round((98000+91000)/2)=94500, total_bonus=round(4900+13650)=18550
  - Finance: E009, E010, E011 → count=3, avg_salary=round((110000+102000+108000)/3)=106667, total_bonus=round(11000+15300+5400)=31700
Step 6 — Sort by total_bonus descending.

```json
[
  { "department": "Engineering", "employee_count": 3, "avg_salary": 120000, "total_bonus": 42250 },
  { "department": "Finance", "employee_count": 3, "avg_salary": 106667, "total_bonus": 31700 },
  { "department": "Marketing", "employee_count": 2, "avg_salary": 94500, "total_bonus": 18550 },
  { "department": "Sales", "employee_count": 2, "avg_salary": 91500, "total_bonus": 14250 }
]
```

### Verification

1. Execute the generated pipeline against the input data
2. Compare output rows against expected output (order matters — sorted by total_bonus desc)
3. Exact match on all values

---

## Test Case 2: Hard Complexity

### Problem Description (given to the model)

```
You have two CSV datasets: orders and products. Generate a data transformation pipeline that produces a sales analysis report.

Orders columns: order_id, customer_id, product_id, quantity, unit_price, discount_percent, order_date, region, channel
Products columns: product_id, product_name, category, supplier, unit_cost

Requirements:
1. Join orders with products on product_id
2. Filter to orders placed between 2025-07-01 and 2025-12-31 (inclusive)
3. Filter out orders where channel is "internal"
4. Compute "revenue" as: quantity * unit_price * (1 - discount_percent / 100)
5. Compute "cost" as: quantity * unit_cost
6. Compute "profit" as: revenue - cost
7. Compute "margin_percent" as: (profit / revenue) * 100, rounded to 1 decimal place
8. First aggregation — group by category and region, compute:
   - order_count: number of orders
   - total_revenue: sum of revenue, rounded to 2 decimal places
   - total_profit: sum of profit, rounded to 2 decimal places
   - avg_margin: mean of margin_percent, rounded to 1 decimal place
9. Filter to groups where order_count >= 2
10. Second aggregation — group by category only, compute:
    - regions_active: number of distinct regions from prior step
    - combined_revenue: sum of total_revenue, rounded to 2 decimal places
    - combined_profit: sum of total_profit, rounded to 2 decimal places
    - best_region: the region with the highest total_revenue within that category
    - best_region_revenue: the total_revenue of that best region, rounded to 2 decimal places
11. Sort by combined_profit descending
12. Output columns: category, regions_active, combined_revenue, combined_profit, best_region, best_region_revenue
```

### Input Data — Orders

```csv
order_id,customer_id,product_id,quantity,unit_price,discount_percent,order_date,region,channel
ORD-001,C100,P01,10,50.00,5,2025-08-12,North,online
ORD-002,C101,P02,3,200.00,10,2025-09-03,North,retail
ORD-003,C102,P01,8,50.00,0,2025-07-22,South,online
ORD-004,C103,P03,15,30.00,20,2025-11-15,South,online
ORD-005,C104,P02,5,200.00,15,2025-10-01,East,retail
ORD-006,C105,P04,20,15.00,0,2025-06-15,North,online
ORD-007,C106,P03,12,30.00,10,2025-08-30,North,retail
ORD-008,C107,P01,6,50.00,5,2025-12-20,East,online
ORD-009,C108,P04,25,15.00,5,2025-09-18,South,online
ORD-010,C109,P02,2,200.00,0,2025-11-05,South,retail
ORD-011,C110,P05,4,120.00,10,2025-10-22,North,online
ORD-012,C111,P05,7,120.00,5,2025-08-14,East,retail
ORD-013,C112,P03,9,30.00,0,2025-07-01,East,online
ORD-014,C113,P01,5,50.00,10,2025-09-09,North,internal
ORD-015,C114,P04,30,15.00,0,2025-12-01,East,online
ORD-016,C115,P05,3,120.00,15,2025-11-11,South,retail
ORD-017,C116,P02,4,200.00,5,2025-08-25,North,online
ORD-018,C117,P03,6,30.00,0,2025-10-10,South,retail
```

### Input Data — Products

```csv
product_id,product_name,category,supplier,unit_cost
P01,Widget Alpha,Widgets,Supplier A,22.00
P02,Gadget Pro,Gadgets,Supplier B,85.00
P03,Widget Beta,Widgets,Supplier A,12.00
P04,Accessory One,Accessories,Supplier C,6.50
P05,Gadget Lite,Gadgets,Supplier B,48.00
```

### Expected Output Data

Step 1 — Join on product_id: all 18 orders get product data attached.
Step 2 — Filter dates 2025-07-01 to 2025-12-31: removes ORD-006 (2025-06-15). 17 rows remain.
Step 3 — Filter out channel "internal": removes ORD-014. 16 rows remain.

Remaining orders with computed values:

| order_id | product_id | category    | region | qty | unit_price | discount% | unit_cost | revenue            | cost    | profit   | margin%  |
|----------|-----------|-------------|--------|-----|------------|-----------|-----------|--------------------|---------|---------  |----------|
| ORD-001  | P01       | Widgets     | North  | 10  | 50.00      | 5         | 22.00     | 475.00             | 220.00  | 255.00   | 53.7     |
| ORD-002  | P02       | Gadgets     | North  | 3   | 200.00     | 10        | 85.00     | 540.00             | 255.00  | 285.00   | 52.8     |
| ORD-003  | P01       | Widgets     | South  | 8   | 50.00      | 0         | 22.00     | 400.00             | 176.00  | 224.00   | 56.0     |
| ORD-004  | P03       | Widgets     | South  | 15  | 30.00      | 20        | 12.00     | 360.00             | 180.00  | 180.00   | 50.0     |
| ORD-005  | P02       | Gadgets     | East   | 5   | 200.00     | 15        | 85.00     | 850.00             | 425.00  | 425.00   | 50.0     |
| ORD-007  | P03       | Widgets     | North  | 12  | 30.00      | 10        | 12.00     | 324.00             | 144.00  | 180.00   | 55.6     |
| ORD-008  | P01       | Widgets     | East   | 6   | 50.00      | 5         | 22.00     | 285.00             | 132.00  | 153.00   | 53.7     |
| ORD-009  | P04       | Accessories | South  | 25  | 15.00      | 5         | 6.50      | 356.25             | 162.50  | 193.75   | 54.4     |
| ORD-010  | P02       | Gadgets     | South  | 2   | 200.00     | 0         | 85.00     | 400.00             | 170.00  | 230.00   | 57.5     |
| ORD-011  | P05       | Gadgets     | North  | 4   | 120.00     | 10        | 48.00     | 432.00             | 192.00  | 240.00   | 55.6     |
| ORD-012  | P05       | Gadgets     | East   | 7   | 120.00     | 5         | 48.00     | 798.00             | 336.00  | 462.00   | 57.9     |
| ORD-013  | P03       | Widgets     | East   | 9   | 30.00      | 0         | 12.00     | 270.00             | 108.00  | 162.00   | 60.0     |
| ORD-015  | P04       | Accessories | East   | 30  | 15.00      | 0         | 6.50      | 450.00             | 195.00  | 255.00   | 56.7     |
| ORD-016  | P05       | Gadgets     | South  | 3   | 120.00     | 15        | 48.00     | 306.00             | 144.00  | 162.00   | 52.9     |
| ORD-017  | P02       | Gadgets     | North  | 4   | 200.00     | 5         | 85.00     | 760.00             | 340.00  | 420.00   | 55.3     |
| ORD-018  | P03       | Widgets     | South  | 6   | 30.00      | 0         | 12.00     | 180.00             | 72.00   | 108.00   | 60.0     |

Step 8 — Group by category + region:

| category    | region | order_count | total_revenue | total_profit | avg_margin |
|-------------|--------|-------------|---------------|--------------|------------|
| Widgets     | North  | 2           | 799.00        | 435.00       | 54.7       |
| Widgets     | South  | 3           | 940.00        | 512.00       | 55.3       |
| Widgets     | East   | 2           | 555.00        | 315.00       | 56.9       |
| Gadgets     | North  | 3           | 1732.00       | 945.00       | 54.6       |
| Gadgets     | East   | 2           | 1648.00       | 887.00       | 54.0       |
| Gadgets     | South  | 2           | 706.00        | 392.00       | 55.2       |
| Accessories | South  | 1           | 356.25        | 193.75       | 54.4       |
| Accessories | East   | 1           | 450.00        | 255.00       | 56.7       |

Step 9 — Filter order_count >= 2: removes Accessories/South (1) and Accessories/East (1). 6 rows remain.

Step 10 — Group by category:

| category | regions_active | combined_revenue | combined_profit | best_region | best_region_revenue |
|----------|---------------|-----------------|----------------|-------------|---------------------|
| Widgets  | 3             | 2294.00         | 1262.00        | South       | 940.00              |
| Gadgets  | 3             | 4086.00         | 2224.00        | North       | 1732.00             |

Step 11 — Sort by combined_profit descending.

```json
[
  { "category": "Gadgets", "regions_active": 3, "combined_revenue": 4086.00, "combined_profit": 2224.00, "best_region": "North", "best_region_revenue": 1732.00 },
  { "category": "Widgets", "regions_active": 3, "combined_revenue": 2294.00, "combined_profit": 1262.00, "best_region": "South", "best_region_revenue": 940.00 }
]
```

### Verification

1. Execute the generated pipeline against both input datasets
2. Compare output rows against expected output (order matters — sorted by combined_profit desc)
3. Numeric values must match within tolerance of 0.01 (floating point)
4. String values must match exactly
