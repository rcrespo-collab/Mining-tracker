import { describe, it, expect } from 'vitest';
import { getTableColumns } from 'drizzle-orm';
import { allTables } from '../schema';

/**
 * Required guardrail test #1 — the product's core premise.
 *
 * There must be no table, column, or enum value anywhere in the schema that
 * stores a rating, score, checklist, or judgement of the *partner's* behaviour,
 * fault, or character (docs/SPEC.md §6.7 schema-level guarantee, and the build
 * brief's non-negotiable #1).
 *
 * The two permitted partner *observation* fields (the ones that could otherwise
 * have been behaviour records) are the core of the guarantee:
 *  - conflict_cycle.partner_role       (a position in the cycle, labelled as perception)
 *  - conflict_repair.partner_repair_attempt   (a positive observation)
 *  - conflict_repair.partner_repair_accepted  (a positive observation)
 *
 * Three further fields merely *reference* the partner as an entity or target and
 * carry no judgement of behaviour or character, so they are also allowed:
 *  - relationship.partner_alias        (a local nickname, §6.2)
 *  - relationship.partner_user_id      (an id; null in solo mode, §6.2)
 *  - positive_event.expressed_to_partner (did the USER voice a positive, §6.11)
 *
 * If this test fails, someone has broken the reason the product exists.
 */

// Exact `table.column` (DB names) allowed to reference the partner.
const PARTNER_FIELD_ALLOWLIST = new Set([
  'conflict_cycle.partner_role',
  'conflict_repair.partner_repair_attempt',
  'conflict_repair.partner_repair_accepted',
  'relationship.partner_alias',
  'relationship.partner_user_id',
  'positive_event.expressed_to_partner',
]);

// snake_case *segments* that mark a column name as partner-referencing. Matched
// per-segment (not substring) so "together_since" never trips on "her".
const PARTNER_NAME_TOKENS = new Set(['partner', 'their', 'them', 'spouse']);

// Columns whose enum values may contain a partner token for a legitimate reason
// (an attribution locus of "partner"; the cycle-position values of partner_role).
const ENUM_PARTNER_VALUE_ALLOWED = new Set([
  'conflict_attribution.locus',
  'conflict_cycle.partner_role',
]);

// Tokens that would indicate a fault/judgement/rating of anyone's character.
// (Scanned across every column name AND every enum value.)
const JUDGEMENT_TOKENS = ['blame', 'fault', 'abusive', 'at_fault', 'guilty', 'wrong_doing'];

function referencesPartnerName(columnName: string): boolean {
  return columnName.split('_').some((seg) => PARTNER_NAME_TOKENS.has(seg));
}

type ColumnRef = { table: string; column: string; enumValues: readonly string[] };

function allColumns(): ColumnRef[] {
  const out: ColumnRef[] = [];
  for (const [, table] of Object.entries(allTables)) {
    const cols = getTableColumns(table);
    for (const [, col] of Object.entries(cols)) {
      const anyCol = col as unknown as { name: string; enumValues?: readonly string[] };
      out.push({
        table: tableNameOf(table),
        column: anyCol.name,
        enumValues: anyCol.enumValues ?? [],
      });
    }
  }
  return out;
}

// Drizzle stores the SQL table name on a well-known symbol.
function tableNameOf(table: object): string {
  const sym = Object.getOwnPropertySymbols(table).find(
    (s) => s.toString() === 'Symbol(drizzle:Name)',
  );
  return sym ? (table as Record<symbol, string>)[sym] : 'unknown';
}

describe('schema guarantee: no partner-rating fields', () => {
  const columns = allColumns();

  it('introspected a non-trivial schema (guard against a silently empty walk)', () => {
    expect(columns.length).toBeGreaterThan(50);
  });

  it('every partner-referencing column is on the explicit allowlist', () => {
    const offenders: string[] = [];
    for (const c of columns) {
      const ref = `${c.table}.${c.column}`;
      if (referencesPartnerName(c.column) && !PARTNER_FIELD_ALLOWLIST.has(ref)) {
        offenders.push(ref);
      }
    }
    expect(offenders, `unexpected partner-referencing columns: ${offenders.join(', ')}`).toEqual([]);
  });

  it('every allowlisted partner field actually exists (allowlist cannot rot)', () => {
    const present = new Set(columns.map((c) => `${c.table}.${c.column}`));
    for (const allowed of PARTNER_FIELD_ALLOWLIST) {
      expect(present.has(allowed), `allowlisted field missing from schema: ${allowed}`).toBe(true);
    }
  });

  it('no column name encodes a fault/judgement of character', () => {
    const offenders = columns
      .filter((c) => JUDGEMENT_TOKENS.some((tok) => c.column.includes(tok)))
      .map((c) => `${c.table}.${c.column}`);
    expect(offenders, `judgement-laden column names: ${offenders.join(', ')}`).toEqual([]);
  });

  it('no enum value encodes a fault/judgement of the partner', () => {
    const offenders: string[] = [];
    for (const c of columns) {
      for (const v of c.enumValues) {
        const ref = `${c.table}.${c.column}`;
        if (JUDGEMENT_TOKENS.some((tok) => v.includes(tok))) {
          offenders.push(`${ref}=${v}`);
        }
        // A partner-token inside an enum *value* is only acceptable for the
        // columns where it is semantically legitimate (attribution locus; the
        // cycle-position values of partner_role).
        if (referencesPartnerName(v) && !ENUM_PARTNER_VALUE_ALLOWED.has(ref)) {
          offenders.push(`${ref}=${v}`);
        }
      }
    }
    expect(offenders, `judgement/partner enum values: ${offenders.join(', ')}`).toEqual([]);
  });
});
