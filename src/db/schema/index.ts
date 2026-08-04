/**
 * Drizzle schema barrel (docs/SPEC.md §6). One import site for the whole model,
 * used by the client, the repositories, migrations, and the schema-guarantee test.
 */
export * from './user';
export * from './relationship';
export * from './conflictEvent';
export * from './conflictContext';
export * from './conflictContent';
export * from './conflictSeverity';
export * from './conflictBehaviour';
export * from './conflictCycle';
export * from './conflictAttribution';
export * from './conflictRepair';
export * from './positiveEvent';
export * from './perpetualTheme';
export * from './assessment';
export * from './ritual';
export * from './sharedItem';
export * from './interventionLog';

import { user } from './user';
import { relationship } from './relationship';
import { conflictEvent } from './conflictEvent';
import { conflictContext } from './conflictContext';
import { conflictContent } from './conflictContent';
import { conflictSeverity } from './conflictSeverity';
import { conflictBehaviour } from './conflictBehaviour';
import { conflictCycle } from './conflictCycle';
import { conflictAttribution } from './conflictAttribution';
import { conflictRepair } from './conflictRepair';
import { positiveEvent } from './positiveEvent';
import { perpetualTheme } from './perpetualTheme';
import { assessmentResult } from './assessment';
import { ritualInstance } from './ritual';
import { sharedItem } from './sharedItem';
import { interventionLog } from './interventionLog';

/** Every table, keyed by its export name — used by the schema-guarantee test. */
export const allTables = {
  user,
  relationship,
  conflictEvent,
  conflictContext,
  conflictContent,
  conflictSeverity,
  conflictBehaviour,
  conflictCycle,
  conflictAttribution,
  conflictRepair,
  positiveEvent,
  perpetualTheme,
  assessmentResult,
  ritualInstance,
  sharedItem,
  interventionLog,
} as const;
