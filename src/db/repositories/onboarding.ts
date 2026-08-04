/**
 * Onboarding data access (S-01…S-05). Creates the single solo-mode user and
 * relationship, records the safety-screen result, and advances the onboarding
 * stage. The partner alias is encrypted at rest.
 */
import { eq } from 'drizzle-orm';
import { getDb, getKey } from '../client';
import { user, relationship } from '../schema';
import { encryptNullable, decryptString } from '../crypto';
import { newId } from '../../lib/id';
import type { SafetyOutcome } from '../../lib/safety/screen';
import type { RelationshipStatus } from '../enums';

export interface Identity {
  userId: string;
  relationshipId: string;
}

/** The single current user (solo mode), or null before onboarding starts. */
export async function getCurrentUser() {
  const rows = await getDb().select().from(user).limit(1);
  return rows[0] ?? null;
}

export async function getCurrentRelationship(userId: string) {
  const rows = await getDb().select().from(relationship).where(eq(relationship.userId, userId)).limit(1);
  return rows[0] ?? null;
}

/** Create the user + relationship at the start of onboarding (idempotent). */
export async function startOnboarding(): Promise<Identity> {
  const db = getDb();
  const existing = await getCurrentUser();
  if (existing) {
    const rel = await getCurrentRelationship(existing.id);
    if (rel) return { userId: existing.id, relationshipId: rel.id };
  }

  const userId = existing?.id ?? newId();
  if (!existing) {
    await db.insert(user).values({
      id: userId,
      createdAt: new Date(),
      onboardingStage: 'welcome',
      mode: 'solo',
      safetyFlag: 'clear',
      linkedModeEligible: true,
      pinEnabled: false,
      discreetMode: false,
      ageConfirmed18: false,
    });
  }
  const relationshipId = newId();
  await db.insert(relationship).values({ id: relationshipId, userId });
  return { userId, relationshipId };
}

/** Record the S-02 safety result (§9): flag, eligibility, screened timestamp. */
export async function setSafetyResult(userId: string, outcome: SafetyOutcome): Promise<void> {
  await getDb()
    .update(user)
    .set({
      safetyFlag: outcome.flag,
      safetyScreenedAt: new Date(),
      linkedModeEligible: outcome.linkedModeEligible,
      onboardingStage: 'basics',
    })
    .where(eq(user.id, userId));
}

export interface BasicsInput {
  partnerAlias: string | null;
  status: RelationshipStatus | null;
  togetherSince: string | null; // ISO date
  cohabiting: boolean | null;
  childrenInHome: number | null;
  inCouplesTherapy: boolean | null;
  ageConfirmed18: boolean;
}

export async function setBasics(id: Identity, input: BasicsInput): Promise<void> {
  const db = getDb();
  await db
    .update(relationship)
    .set({
      partnerAlias: encryptNullable(input.partnerAlias, getKey()),
      status: input.status ?? undefined,
      togetherSince: input.togetherSince,
      cohabiting: input.cohabiting,
      childrenInHome: input.childrenInHome,
      inCouplesTherapy: input.inCouplesTherapy,
    })
    .where(eq(relationship.id, id.relationshipId));
  await db
    .update(user)
    .set({ ageConfirmed18: input.ageConfirmed18, onboardingStage: 'baseline' })
    .where(eq(user.id, id.userId));
}

export async function setOnboardingStage(
  userId: string,
  stage: 'welcome' | 'safety' | 'basics' | 'baseline' | 'mode' | 'complete',
): Promise<void> {
  await getDb().update(user).set({ onboardingStage: stage }).where(eq(user.id, userId));
}

/** Complete onboarding in solo mode. */
export async function completeOnboardingSolo(userId: string): Promise<void> {
  await getDb()
    .update(user)
    .set({ mode: 'solo', onboardingStage: 'complete' })
    .where(eq(user.id, userId));
}

/** Persist the security/appearance flags shown on the You tab (S-34). */
export async function setUserFlags(
  userId: string,
  flags: { pinEnabled?: boolean; discreetMode?: boolean },
): Promise<void> {
  await getDb().update(user).set(flags).where(eq(user.id, userId));
}

/** Decrypt a stored partner alias for display (only the user ever sees it). */
export function decryptAlias(cipher: string | null): string | null {
  if (cipher == null) return null;
  return decryptString(cipher, getKey());
}
