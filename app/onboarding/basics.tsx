/**
 * S-03 — Relationship basics. Partner nickname (only the user ever sees it,
 * encrypted at rest), status, together-since, cohabiting, children, therapy, and
 * the 18+ age confirmation (§9.5 / decision D9).
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Button, RadioGroup, FieldLabel, TextField } from '../../src/components';
import { useTheme } from '../../src/design/theme';
import { setBasics } from '../../src/db/repositories/onboarding';
import { useSessionStore } from '../../src/stores/sessionStore';
import { toOptions } from '../../src/copy/labels';
import { relationshipStatus } from '../../src/db/enums';
import type { RelationshipStatus } from '../../src/db/enums';

const statusOptions = toOptions<RelationshipStatus>(
  Object.fromEntries(relationshipStatus.values.map((v) => [v, labelFor(v)])) as Record<
    RelationshipStatus,
    string
  >,
);

function labelFor(v: RelationshipStatus): string {
  const map: Record<RelationshipStatus, string> = {
    dating: 'Dating',
    engaged: 'Engaged',
    cohabiting: 'Living together',
    married: 'Married',
    civil_union: 'Civil union',
    separated: 'Separated',
  };
  return map[v];
}

export default function Basics() {
  const theme = useTheme();
  const userId = useSessionStore((s) => s.userId);
  const relationshipId = useSessionStore((s) => s.relationshipId);

  const [alias, setAlias] = useState('');
  const [status, setStatus] = useState<RelationshipStatus | null>(null);
  const [cohabiting, setCohabiting] = useState<boolean | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState<boolean | null>(null);

  const onContinue = async () => {
    if (!userId || !relationshipId || ageConfirmed !== true) return;
    await setBasics(
      { userId, relationshipId },
      {
        partnerAlias: alias.trim() ? alias.trim() : null,
        status,
        togetherSince: null,
        cohabiting,
        childrenInHome: null,
        inCouplesTherapy: null,
        ageConfirmed18: true,
      },
    );
    router.push('/onboarding/baseline');
  };

  return (
    <Screen quickExit footer={<Button label="Continue" onPress={onContinue} disabled={ageConfirmed !== true} />}>
      <Text role="title">About your relationship</Text>

      <View style={{ marginTop: theme.spacing.md }}>
        <FieldLabel help="Only you see this.">Partner's name or nickname</FieldLabel>
        <TextField value={alias} onChangeText={setAlias} placeholder="A name only you will see" />
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <FieldLabel>Relationship status</FieldLabel>
        <RadioGroup value={status} onChange={setStatus} options={statusOptions} />
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <FieldLabel>Living together?</FieldLabel>
        <RadioGroup
          value={cohabiting === null ? null : cohabiting ? 'yes' : 'no'}
          onChange={(v) => setCohabiting(v === 'yes')}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <FieldLabel help="This app is for adults.">Are you 18 or older?</FieldLabel>
        <RadioGroup
          value={ageConfirmed === null ? null : ageConfirmed ? 'yes' : 'no'}
          onChange={(v) => setAgeConfirmed(v === 'yes')}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
        {ageConfirmed === false ? (
          <Text role="small" color="textMuted" style={{ marginTop: theme.spacing.xs }}>
            You need to be 18 to use this app.
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
