"use client";

import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import {
  ScrollableTable as OpenUITable,
  TableBody as OpenUITableBody,
  TableCell as OpenUITableCell,
  TableHead as OpenUITableHead,
  TableHeader as OpenUITableHeader,
  TableRow as OpenUITableRow,
} from "../../components/Table";
import { ColSchema } from "./schema";

export { ColSchema } from "./schema";

// ── Col ───────────────────────────────────────────────────────────────────────

export const Col = defineComponent({
  name: "Col",
  props: ColSchema,
  description: 'Column definition. Use type="action" for columns with Button/ButtonGroup actions.',
  component: () => null,
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalize a row from the Renderer (may be array, {cells:[...]}, or {children:[...]}) */
function toArray(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>;
    if ("cells" in obj && Array.isArray(obj["cells"])) return obj["cells"] as unknown[];
    if ("children" in obj && Array.isArray(obj["children"])) return obj["children"] as unknown[];
  }
  return [];
}

/** Map column type to alignment */
function colAlign(type?: string): "left" | "right" {
  return type === "number" ? "right" : "left";
}

// ── Table ─────────────────────────────────────────────────────────────────────

export const Table = defineComponent({
  name: "Table",
  props: z.object({
    columns: z.array(Col.ref),
    rows: z.array(
      z.array(z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.any())])),
    ),
  }),
  description: "Data table",
  component: ({ props, renderNode }) => {
    const columns = props.columns ?? [];
    const rawRows = (props.rows ?? []) as unknown[];

    if (!columns.length) return null;

    return (
      <OpenUITable>
        <OpenUITableHeader>
          <OpenUITableRow>
            {columns.map((c, i) => (
              <OpenUITableHead
                key={i}
                align={colAlign(c.props.type)}
                icon={c.props.icon ? renderNode(c.props.icon) : undefined}
              >
                {c.props.label}
              </OpenUITableHead>
            ))}
          </OpenUITableRow>
        </OpenUITableHeader>
        <OpenUITableBody>
          {rawRows.map((rawRow, ri) => {
            const cells = toArray(rawRow);
            return (
              <OpenUITableRow key={ri}>
                {cells.map((cell: unknown, ci: number) => {
                  const col = columns[ci];
                  const align = col ? colAlign(col.props.type) : "left";

                  return (
                    <OpenUITableCell key={ci} align={align}>
                      {typeof cell === "object" && cell !== null
                        ? renderNode(cell)
                        : String(cell ?? "")}
                    </OpenUITableCell>
                  );
                })}
              </OpenUITableRow>
            );
          })}
        </OpenUITableBody>
      </OpenUITable>
    );
  },
});
