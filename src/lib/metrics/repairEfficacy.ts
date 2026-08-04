/**
 * Repair efficacy (docs/SPEC.md §7.7).
 *
 *   own_repair_landing_rate    = own_repair_received    / own_repair_attempt
 *   partner_repair_accept_rate = partner_repair_accepted / partner_repair_attempt
 *
 * The second is the more clinically informative and the one the user can
 * directly change — in distressed couples repair attempts are *made* but not
 * *received*. Rates are null when their denominator is zero (nothing to divide).
 */
import type { RepairForEfficacy } from './types';

export interface RepairEfficacyResult {
  ownRepairLandingRate: number | null;
  ownRepairAttempts: number;
  ownRepairReceived: number;
  partnerRepairAcceptRate: number | null;
  partnerRepairAttempts: number;
  partnerRepairAccepted: number;
}

export function computeRepairEfficacy(repairs: RepairForEfficacy[]): RepairEfficacyResult {
  let ownAttempts = 0;
  let ownReceived = 0;
  let partnerAttempts = 0;
  let partnerAccepted = 0;

  for (const r of repairs) {
    if (r.ownRepairAttempt) {
      ownAttempts += 1;
      if (r.ownRepairReceived) ownReceived += 1;
    }
    if (r.partnerRepairAttempt) {
      partnerAttempts += 1;
      if (r.partnerRepairAccepted) partnerAccepted += 1;
    }
  }

  return {
    ownRepairLandingRate: ownAttempts > 0 ? ownReceived / ownAttempts : null,
    ownRepairAttempts: ownAttempts,
    ownRepairReceived: ownReceived,
    partnerRepairAcceptRate: partnerAttempts > 0 ? partnerAccepted / partnerAttempts : null,
    partnerRepairAttempts: partnerAttempts,
    partnerRepairAccepted: partnerAccepted,
  };
}
