/**
 * S-11…S-18 — The seven-step deep log plus summary. Resumable: a draft
 * conflict_event is created (or upgraded from a quick log) on entry, and each
 * step persists as the user advances, so an interrupted flow can be picked up
 * from Home. S-15 (cycle & emotion) is the clinical core and is not cut.
 *
 * Step 4 asks ONLY about the user's own behaviour; there is never a screen that
 * rates the partner. Composite severity is computed on save but never shown.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen, Text, Button, StepBar, RadioGroup, Checklist, IntensityScale, FieldLabel, TextField } from '../../../src/components';
import { ChipGroup } from '../../../src/components/Chips';
import { useTheme } from '../../../src/design/theme';
import { useSessionStore } from '../../../src/stores/sessionStore';
import * as C from '../../../src/db/repositories/conflicts';
import { runInterventionEvaluation } from '../../../src/features/interventionRunner';
import {
  toOptions,
  surfaceTopicLabel,
  hiddenIssueLabel,
  escalationLabel,
  personalisationLabel,
  floodingSignLabel,
  stressOriginLabel,
  settingLabel,
  privacyLabel,
  vulnerabilityLabel,
  horsemanLabel,
  antidoteLabel,
  ownRoleLabel,
  secondaryEmotionLabel,
  primaryEmotionLabel,
  attachmentNeedLabel,
  resolutionLabel,
} from '../../../src/copy/labels';
import type {
  Setting,
  Privacy,
  Vulnerability,
  StressOrigin,
  SurfaceTopic,
  HiddenIssue,
  EscalationSlope,
  Personalisation,
  FloodingSign,
  Horseman,
  Antidote,
  OwnRole,
  SecondaryEmotion,
  PrimaryEmotion,
  AttachmentNeed,
  Resolution,
} from '../../../src/db/enums';

const TOTAL = 7;
const RECOVERY_OPTIONS = [
  { value: '10', label: 'A few minutes' },
  { value: '60', label: 'About an hour' },
  { value: '120', label: 'A couple of hours' },
  { value: '360', label: 'Half a day' },
  { value: '1440', label: 'A day or more' },
];
const RECONNECT_OPTIONS = [
  { value: '1', label: 'About an hour' },
  { value: '3', label: 'A few hours' },
  { value: '24', label: 'By the next day' },
  { value: '72', label: 'A few days' },
];
const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export default function DeepLog() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ draftId?: string; step?: string; floodedOverride?: string }>();
  const userId = useSessionStore((s) => s.userId);
  const relationshipId = useSessionStore((s) => s.relationshipId);

  const [eventId, setEventId] = useState<string | null>(null);
  const [step, setStep] = useState(Number(params.step ?? '1'));
  const [busy, setBusy] = useState(false);

  // Step state
  const [setting, setSetting] = useState<Setting | null>(null);
  const [privacy, setPrivacy] = useState<Privacy | null>(null);
  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [stressOrigin, setStressOrigin] = useState<StressOrigin | null>(null);

  const [topic, setTopic] = useState<SurfaceTopic | null>(null);
  const [detail, setDetail] = useState('');
  const [hidden, setHidden] = useState<HiddenIssue | null>(null);

  const [peak, setPeak] = useState<number | null>(null);
  const [slope, setSlope] = useState<EscalationSlope | null>(null);
  const [personal, setPersonal] = useState<Personalisation | null>(null);
  const [floodSigns, setFloodSigns] = useState<FloodingSign[]>([]);
  const [recovery, setRecovery] = useState<string | null>(null);

  const [horsemen, setHorsemen] = useState<Horseman[]>([]);
  const [antidotes, setAntidotes] = useState<Antidote[]>([]);
  const [ownContribution, setOwnContribution] = useState('');

  const [ownRole, setOwnRole] = useState<OwnRole | null>(null);
  const [secondary, setSecondary] = useState<SecondaryEmotion | null>(null);
  const [primary, setPrimary] = useState<PrimaryEmotion | null>(null);
  const [need, setNeed] = useState<AttachmentNeed | null>(null);

  const [initialAttr, setInitialAttr] = useState('');
  const [reappraisal, setReappraisal] = useState('');

  const [ownAttempt, setOwnAttempt] = useState<boolean | null>(null);
  const [ownReceived, setOwnReceived] = useState<boolean | null>(null);
  const [partnerAttempt, setPartnerAttempt] = useState<boolean | null>(null);
  const [partnerAccepted, setPartnerAccepted] = useState<boolean | null>(null);
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [reconnected, setReconnected] = useState<boolean | null>(null);
  const [reconnectHours, setReconnectHours] = useState<string | null>(null);

  // Create or upgrade the draft on entry.
  useEffect(() => {
    (async () => {
      if (!userId || !relationshipId) return;
      const floodedOverride = params.floodedOverride === '1';
      if (params.draftId) {
        await C.upgradeToDeep(params.draftId, floodedOverride);
        setEventId(params.draftId);
      } else {
        const id = await C.createDeepDraft(userId, relationshipId, new Date(), floodedOverride);
        setEventId(id);
      }
    })();
  }, []);

  const persistStep = async (): Promise<boolean> => {
    if (!eventId) return false;
    setBusy(true);
    try {
      switch (step) {
        case 1:
          await C.saveStep1(eventId, {
            occurredAt: new Date(),
            durationMin: null,
            setting,
            privacy,
            vulnerabilities: vulns,
            stressOrigin,
          });
          return true;
        case 2:
          await C.saveStep2(eventId, {
            surfaceTopic: topic,
            surfaceTopicDetail: detail.trim() || null,
            hiddenIssue: hidden,
          });
          return true;
        case 3:
          await C.saveStep3(eventId, {
            peakIntensity: peak ?? 3,
            escalationSlope: slope ?? 'gradual',
            personalisation: personal ?? 'issue_focused',
            floodingSigns: floodSigns.length ? floodSigns : ['none'],
            recoveryMinutes: recovery ? Number(recovery) : null,
          });
          return true;
        case 4:
          await C.saveStep4(eventId, {
            horsemen: horsemen.length ? horsemen : ['none'],
            antidotes: antidotes.length ? antidotes : ['none'],
            ownContribution: ownContribution.trim() || null,
          });
          return true;
        case 5:
          await C.saveStep5(eventId, {
            ownRole,
            partnerRole: null, // captured on the cycle map (Phase 2), never as a rating
            secondaryEmotion: secondary,
            primaryEmotion: primary,
            attachmentNeed: need,
            needVoiced: false,
          });
          return true;
        case 6:
          await C.saveStep6(eventId, {
            initialAttribution: initialAttr.trim() || null,
            reappraisal: reappraisal.trim() || null,
            reappraisalCompleted: reappraisal.trim().length > 0,
          });
          return true;
        case 7:
          await C.saveStep7(eventId, {
            ownRepairAttempt: ownAttempt ?? false,
            ownRepairReceived: ownAttempt ? ownReceived : null,
            partnerRepairAttempt: partnerAttempt,
            partnerRepairAccepted: partnerAttempt ? partnerAccepted : null,
            repairTypes: [],
            resolution,
            reconnected: reconnected ?? false,
            reconnectedHoursAfter: reconnected && reconnectHours ? Number(reconnectHours) : null,
          });
          return true;
        default:
          return true;
      }
    } finally {
      setBusy(false);
    }
  };

  const next = async () => {
    const ok = await persistStep();
    if (!ok) return;
    setStep((s) => s + 1);
  };

  const save = async () => {
    if (!userId) return;
    // Fire the intervention evaluator with the signals this entry produced.
    await runInterventionEvaluation(userId, new Date(), {
      criticismLogged: horsemen.includes('criticism'),
      resolutionPerpetualSelected: resolution === 'perpetual',
      loggedWhileFlooded: params.floodedOverride === '1',
    });
    if (eventId) {
      router.replace({ pathname: '/(tabs)/log/entry/[id]', params: { id: eventId } });
    } else {
      router.replace('/(tabs)/log');
    }
  };

  const title = useMemo(() => (step <= TOTAL ? 'Details' : 'Before you save'), [step]);

  // ── Summary (S-18) ──
  if (step > TOTAL) {
    return (
      <Screen footer={<Button label="Save" onPress={save} loading={busy} />}>
        <Text role="title">Before you save</Text>
        <View style={{ gap: theme.spacing.xs }}>
          {topic ? <Text role="body">About: {surfaceTopicLabel[topic].toLowerCase()}</Text> : null}
          {hidden ? (
            <Text role="body">Really about: {hiddenIssueLabel[hidden].split(' —')[0].toLowerCase()}</Text>
          ) : null}
          {ownRole ? <Text role="body" color="textMuted">{ownRoleLabel[ownRole]}</Text> : null}
          {primary ? (
            <Text role="body" color="textMuted">
              Underneath, you felt {primaryEmotionLabel[primary].toLowerCase()}.
            </Text>
          ) : null}
          {need ? (
            <Text role="body" color="textMuted">
              You needed to know: {attachmentNeedLabel[need].toLowerCase()}
            </Text>
          ) : null}
          <Text role="body" color="textMuted">
            {reconnected ? 'Reconnected.' : 'Still unrepaired.'}
          </Text>
        </View>
        <Text role="small" color="textFaint">
          Only your own behaviour is recorded here. Nothing rates your partner.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <Button
          label={step === TOTAL ? 'Finish' : 'Next'}
          onPress={next}
          loading={busy}
        />
      }
    >
      <StepBar step={step} total={TOTAL} title={title} />

      {step === 1 ? (
        <View style={{ gap: theme.spacing.md }}>
          <FieldLabel>Where were you?</FieldLabel>
          <RadioGroup value={setting} onChange={setSetting} options={toOptions(settingLabel)} />
          <FieldLabel>Who else was there?</FieldLabel>
          <RadioGroup value={privacy} onChange={setPrivacy} options={toOptions(privacyLabel)} />
          <FieldLabel>What was already going on?</FieldLabel>
          <Checklist values={vulns} onChange={setVulns} exclusive="none" options={toOptions(vulnerabilityLabel)} />
          <FieldLabel>Where did the stress start?</FieldLabel>
          <RadioGroup value={stressOrigin} onChange={setStressOrigin} options={toOptions(stressOriginLabel)} />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={{ gap: theme.spacing.md }}>
          <FieldLabel help="Fights about the credit card are rarely about the credit card.">
            On the surface, it was about
          </FieldLabel>
          <ChipGroup
            chips={toOptions(surfaceTopicLabel).map((o) => ({ value: o.value, label: o.label }))}
            selected={topic ? [topic] : []}
            onToggle={(v) => setTopic(topic === v ? null : (v as SurfaceTopic))}
          />
          <TextField value={detail} onChangeText={setDetail} placeholder="In a few words" />
          <FieldLabel>Underneath, what was really at stake for you?</FieldLabel>
          <RadioGroup value={hidden} onChange={setHidden} options={toOptions(hiddenIssueLabel)} />
        </View>
      ) : null}

      {step === 3 ? (
        <View style={{ gap: theme.spacing.md }}>
          <FieldLabel>How intense at its peak?</FieldLabel>
          <IntensityScale value={peak} onChange={setPeak} lowLabel="tense" highLabel="explosive" />
          <FieldLabel>How fast did it escalate?</FieldLabel>
          <RadioGroup value={slope} onChange={setSlope} options={toOptions(escalationLabel)} />
          <FieldLabel>Did it become personal?</FieldLabel>
          <RadioGroup value={personal} onChange={setPersonal} options={toOptions(personalisationLabel)} />
          <FieldLabel>Did you flood?</FieldLabel>
          <Checklist values={floodSigns} onChange={setFloodSigns} exclusive="none" options={toOptions(floodingSignLabel)} />
          <FieldLabel>How long before you felt normal again?</FieldLabel>
          <RadioGroup value={recovery} onChange={setRecovery} options={RECOVERY_OPTIONS} />
        </View>
      ) : null}

      {step === 4 ? (
        <View style={{ gap: theme.spacing.md }}>
          <Text role="body" color="textMuted">
            This part is only about you. You'll never be asked to rate your partner.
          </Text>
          <FieldLabel>Did any of these show up in how you handled it?</FieldLabel>
          <Checklist
            values={horsemen}
            onChange={setHorsemen}
            exclusive="none"
            options={(Object.keys(horsemanLabel) as Horseman[]).map((v) => ({
              value: v,
              label: horsemanLabel[v].label,
              help: horsemanLabel[v].help || undefined,
            }))}
          />
          <FieldLabel>What did you do that helped?</FieldLabel>
          <Checklist values={antidotes} onChange={setAntidotes} exclusive="none" options={toOptions(antidoteLabel)} />
          <FieldLabel>In one line, my share of it</FieldLabel>
          <TextField value={ownContribution} onChangeText={setOwnContribution} placeholder="My part in it" multiline />
        </View>
      ) : null}

      {step === 5 ? (
        <View style={{ gap: theme.spacing.md }}>
          <FieldLabel>When it heated up, you were mostly</FieldLabel>
          <RadioGroup value={ownRole} onChange={setOwnRole} options={toOptions(ownRoleLabel)} />
          <FieldLabel>On the outside, they saw</FieldLabel>
          <RadioGroup value={secondary} onChange={setSecondary} options={toOptions(secondaryEmotionLabel)} />
          <FieldLabel help="Anger is usually the bodyguard for something softer.">
            Underneath that, what were you actually feeling?
          </FieldLabel>
          <RadioGroup value={primary} onChange={setPrimary} options={toOptions(primaryEmotionLabel)} />
          <FieldLabel>What were you needing to know?</FieldLabel>
          <RadioGroup value={need} onChange={setNeed} options={toOptions(attachmentNeedLabel)} />
        </View>
      ) : null}

      {step === 6 ? (
        <View style={{ gap: theme.spacing.md }}>
          <FieldLabel>Why do you think they acted the way they did?</FieldLabel>
          <TextField value={initialAttr} onChangeText={setInitialAttr} placeholder="Your first answer" multiline />
          <FieldLabel help="Holding two explanations at once is what stops a fight becoming a verdict.">
            A harder question: what's a reason that has nothing to do with not caring about you?
          </FieldLabel>
          <TextField value={reappraisal} onChangeText={setReappraisal} placeholder="Another possible reason" multiline />
        </View>
      ) : null}

      {step === 7 ? (
        <View style={{ gap: theme.spacing.md }}>
          <FieldLabel help="A joke, a touch, 'let me start again', an apology mid-fight.">
            Did either of you try to de-escalate during it?
          </FieldLabel>
          <Text role="small" color="textMuted">I tried</Text>
          <RadioGroup value={boolToStr(ownAttempt)} onChange={(v) => setOwnAttempt(v === 'yes')} options={yesNo} />
          {ownAttempt ? (
            <>
              <Text role="small" color="textMuted">Did it land?</Text>
              <RadioGroup value={boolToStr(ownReceived)} onChange={(v) => setOwnReceived(v === 'yes')} options={yesNo} />
            </>
          ) : null}
          <Text role="small" color="textMuted">They tried</Text>
          <RadioGroup value={boolToStr(partnerAttempt)} onChange={(v) => setPartnerAttempt(v === 'yes')} options={yesNo} />
          {partnerAttempt ? (
            <>
              <Text role="small" color="textMuted">Did I accept it?</Text>
              <RadioGroup value={boolToStr(partnerAccepted)} onChange={(v) => setPartnerAccepted(v === 'yes')} options={yesNo} />
            </>
          ) : null}
          <FieldLabel>Where did it end up?</FieldLabel>
          <RadioGroup value={resolution} onChange={setResolution} options={toOptions(resolutionLabel)} />
          <FieldLabel>Are you reconnected now?</FieldLabel>
          <RadioGroup value={boolToStr(reconnected)} onChange={(v) => setReconnected(v === 'yes')} options={yesNo} />
          {reconnected ? (
            <>
              <Text role="small" color="textMuted">How long did it take?</Text>
              <RadioGroup value={reconnectHours} onChange={setReconnectHours} options={RECONNECT_OPTIONS} />
            </>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}

function boolToStr(b: boolean | null): string | null {
  return b === null ? null : b ? 'yes' : 'no';
}
