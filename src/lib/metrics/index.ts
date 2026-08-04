/**
 * Derived metrics (docs/SPEC.md §7). Pure functions, each unit-tested at its
 * boundary conditions.
 *
 * Note: `computeCompositeSeverity` is exported for the data/aggregation layer
 * only. It must never be threaded into a render path — see the
 * severity-containment guardrail test.
 */
export { computeCompositeSeverity } from './compositeSeverity';
export { computeConnectionRatio, type ConnectionRatioResult } from './connectionRatio';
export { computeTimeToRepair, type TimeToRepairResult } from './timeToRepair';
export {
  computeTriggerAssociations,
  type TriggerAssociation,
} from './triggerAssociations';
export { computeRepairEfficacy, type RepairEfficacyResult } from './repairEfficacy';
export * from './types';
