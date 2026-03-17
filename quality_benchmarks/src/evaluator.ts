export type ErrorType =
  | "wrong_value"
  | "missing_field"
  | "extra_field"
  | "wrong_type"
  | "null_instead_of_value";

export interface FieldError {
  run: number;
  format: "json" | "lang";
  fieldPath: string;
  expected: unknown;
  actual: unknown;
  errorType: ErrorType;
}

export interface EvalResult {
  totalFields: number;
  correctFields: number;
  accuracy: number;
  isComplete: boolean;
  errors: FieldError[];
}

function countLeafFields(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (Array.isArray(value)) {
    let count = 0;
    for (const item of value) {
      if (typeof item === "object" && item !== null) {
        count += countLeafFields(item);
      } else {
        count += 1;
      }
    }
    return count;
  }
  if (typeof value === "object") {
    let count = 0;
    for (const v of Object.values(value as Record<string, unknown>)) {
      count += countLeafFields(v);
    }
    return count;
  }
  return 1;
}

export function evaluateExtraction(
  groundTruth: unknown,
  extracted: unknown,
  run: number,
  format: "json" | "lang",
  path: string = "",
): EvalResult {
  const errors: FieldError[] = [];
  let totalFields = 0;
  let correctFields = 0;

  function compare(gt: unknown, ex: unknown, currentPath: string): void {
    // null/undefined ground truth — skip (optional not present)
    if (gt === null || gt === undefined) return;

    // Arrays
    if (Array.isArray(gt)) {
      // Arrays of primitives: each element is one field
      const isPrimitive = gt.length === 0 || typeof gt[0] !== "object" || gt[0] === null;
      if (isPrimitive) {
        totalFields += gt.length;
        if (!Array.isArray(ex)) {
          for (let i = 0; i < gt.length; i++) {
            errors.push({
              run,
              format,
              fieldPath: `${currentPath}[${i}]`,
              expected: gt[i],
              actual: undefined,
              errorType: "missing_field",
            });
          }
          return;
        }
        for (let i = 0; i < gt.length; i++) {
          const exVal = ex[i];
          if (exVal === undefined || exVal === null) {
            errors.push({
              run,
              format,
              fieldPath: `${currentPath}[${i}]`,
              expected: gt[i],
              actual: exVal,
              errorType: exVal === null ? "null_instead_of_value" : "missing_field",
            });
          } else if (
            typeof gt[i] === "number" &&
            typeof exVal === "number" &&
            Math.abs(exVal - gt[i]) < 0.001
          ) {
            correctFields++;
          } else if (gt[i] === exVal) {
            correctFields++;
          } else {
            errors.push({
              run,
              format,
              fieldPath: `${currentPath}[${i}]`,
              expected: gt[i],
              actual: exVal,
              errorType: "wrong_value",
            });
          }
        }
        return;
      }

      // Arrays of objects: recurse into each element
      for (let i = 0; i < gt.length; i++) {
        const exItem = Array.isArray(ex) ? ex[i] : undefined;
        if (exItem === undefined || exItem === null) {
          const missing = countLeafFields(gt[i]);
          totalFields += missing;
          errors.push({
            run,
            format,
            fieldPath: `${currentPath}[${i}]`,
            expected: gt[i],
            actual: exItem,
            errorType: exItem === null ? "null_instead_of_value" : "missing_field",
          });
        } else {
          compare(gt[i], exItem, `${currentPath}[${i}]`);
        }
      }
      return;
    }

    // Objects
    if (typeof gt === "object" && gt !== null) {
      if (typeof ex !== "object" || ex === null || Array.isArray(ex)) {
        const missing = countLeafFields(gt);
        totalFields += missing;
        errors.push({
          run,
          format,
          fieldPath: currentPath || "root",
          expected: gt,
          actual: ex,
          errorType: ex === null ? "null_instead_of_value" : "wrong_type",
        });
        return;
      }
      const gtObj = gt as Record<string, unknown>;
      const exObj = ex as Record<string, unknown>;
      for (const [key, gtVal] of Object.entries(gtObj)) {
        if (gtVal === undefined) continue;
        const fieldPath = currentPath ? `${currentPath}.${key}` : key;
        const exVal = exObj[key];
        compare(gtVal, exVal, fieldPath);
      }
      return;
    }

    // Leaf value (primitive)
    totalFields++;
    if (ex === null) {
      errors.push({
        run,
        format,
        fieldPath: currentPath,
        expected: gt,
        actual: ex,
        errorType: "null_instead_of_value",
      });
    } else if (ex === undefined) {
      errors.push({
        run,
        format,
        fieldPath: currentPath,
        expected: gt,
        actual: ex,
        errorType: "missing_field",
      });
    } else if (typeof ex !== typeof gt) {
      // Try loose comparison for numbers vs strings
      if (String(ex) === String(gt)) {
        correctFields++;
      } else {
        errors.push({
          run,
          format,
          fieldPath: currentPath,
          expected: gt,
          actual: ex,
          errorType: "wrong_type",
        });
      }
    } else if (typeof gt === "number") {
      // Allow small floating point differences
      if (Math.abs((ex as number) - gt) < 0.001) {
        correctFields++;
      } else {
        errors.push({
          run,
          format,
          fieldPath: currentPath,
          expected: gt,
          actual: ex,
          errorType: "wrong_value",
        });
      }
    } else if (gt === ex) {
      correctFields++;
    } else {
      errors.push({
        run,
        format,
        fieldPath: currentPath,
        expected: gt,
        actual: ex,
        errorType: "wrong_value",
      });
    }
  }

  compare(groundTruth, extracted, path);

  const accuracy = totalFields > 0 ? correctFields / totalFields : 0;
  return {
    totalFields,
    correctFields,
    accuracy,
    isComplete: accuracy === 1.0,
    errors,
  };
}
