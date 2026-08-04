import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { ts, bool, enumText, enumCheck } from './_common';
import { conflictEvent } from './conflictEvent';
import * as e from '../enums';

/**
 * §6.10 `conflict_repair` (1:1).
 *
 * `partnerRepairAttempt` and `partnerRepairAccepted` are the permitted
 * partner-referencing fields here — both are *positive* observations (did the
 * partner reach for repair; did I accept it), never a fault record. Allowlisted.
 */
export const conflictRepair = sqliteTable(
  'conflict_repair',
  {
    conflictId: text('conflict_id')
      .primaryKey()
      .references(() => conflictEvent.id),
    ownRepairAttempt: bool('own_repair_attempt'),
    ownRepairReceived: bool('own_repair_received'),
    partnerRepairAttempt: bool('partner_repair_attempt'), // positive observation, allowlisted
    partnerRepairAccepted: bool('partner_repair_accepted'), // positive observation, allowlisted
    repairTypes: text('repair_types'), // enum[] JSON
    resolution: enumText('resolution', e.resolution.values),
    reconnected: bool('reconnected'),
    reconnectedAt: ts('reconnected_at'),
    timeToRepairHours: real('time_to_repair_hours'), // derived §7.3
    reconnectionRitual: text('reconnection_ritual'),
    aftermathCompleted: bool('aftermath_completed'),
  },
  (t) => [enumCheck('conflict_repair_resolution_ck', t.resolution, e.resolution.values)],
);

export type ConflictRepair = typeof conflictRepair.$inferSelect;
export type NewConflictRepair = typeof conflictRepair.$inferInsert;
