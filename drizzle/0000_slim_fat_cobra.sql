CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`display_name` text,
	`dob_year` integer,
	`gender` text,
	`locale` text,
	`timezone` text,
	`onboarding_stage` text NOT NULL,
	`mode` text NOT NULL,
	`safety_flag` text NOT NULL,
	`safety_screened_at` integer,
	`linked_mode_eligible` integer NOT NULL,
	`pin_enabled` integer NOT NULL,
	`discreet_mode` integer NOT NULL,
	`age_confirmed_18` integer NOT NULL,
	CONSTRAINT "user_gender_ck" CHECK("gender" IS NULL OR "gender" IN ('female', 'male', 'non_binary', 'other', 'undisclosed')),
	CONSTRAINT "user_onboarding_ck" CHECK("onboarding_stage" IS NULL OR "onboarding_stage" IN ('welcome', 'safety', 'basics', 'baseline', 'mode', 'complete')),
	CONSTRAINT "user_mode_ck" CHECK("mode" IS NULL OR "mode" IN ('solo', 'linked')),
	CONSTRAINT "user_safety_flag_ck" CHECK("safety_flag" IS NULL OR "safety_flag" IN ('clear', 'caution', 'elevated'))
);
--> statement-breakpoint
CREATE TABLE `relationship` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`partner_alias` text,
	`partner_user_id` text,
	`status` text,
	`together_since` text,
	`cohabiting` integer,
	`children_in_home` integer,
	`in_couples_therapy` integer,
	`therapist_share_token` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "relationship_status_ck" CHECK("status" IS NULL OR "status" IN ('dating', 'engaged', 'cohabiting', 'married', 'civil_union', 'separated'))
);
--> statement-breakpoint
CREATE TABLE `conflict_event` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`relationship_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`occurred_at` integer NOT NULL,
	`duration_min` integer,
	`entry_depth` text NOT NULL,
	`completed_steps` integer NOT NULL,
	`logged_while_flooded` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`relationship_id`) REFERENCES `relationship`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "conflict_event_depth_ck" CHECK("entry_depth" IS NULL OR "entry_depth" IN ('quick', 'deep'))
);
--> statement-breakpoint
CREATE TABLE `conflict_context` (
	`conflict_id` text PRIMARY KEY NOT NULL,
	`setting` text,
	`privacy` text,
	`vulnerabilities` text,
	`stress_origin` text,
	`days_since_positive` integer,
	`sleep_hours` real,
	`alcohol_units` integer,
	FOREIGN KEY (`conflict_id`) REFERENCES `conflict_event`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "conflict_context_setting_ck" CHECK("setting" IS NULL OR "setting" IN ('home', 'car', 'phone', 'text', 'work', 'in_public', 'travel', 'other')),
	CONSTRAINT "conflict_context_privacy_ck" CHECK("privacy" IS NULL OR "privacy" IN ('alone', 'children_present', 'others_present', 'public')),
	CONSTRAINT "conflict_context_stress_ck" CHECK("stress_origin" IS NULL OR "stress_origin" IN ('internal', 'external_spillover', 'both', 'unclear'))
);
--> statement-breakpoint
CREATE TABLE `conflict_content` (
	`conflict_id` text PRIMARY KEY NOT NULL,
	`surface_topic` text,
	`surface_topic_detail` text,
	`hidden_issue` text,
	`perpetual_theme_id` text,
	`narrative` text,
	FOREIGN KEY (`conflict_id`) REFERENCES `conflict_event`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "conflict_content_topic_ck" CHECK("surface_topic" IS NULL OR "surface_topic" IN ('money', 'chores_division', 'sex_intimacy', 'time_together', 'phones_screens', 'in_laws', 'parenting', 'work_hours', 'jealousy_trust', 'communication', 'plans_future', 'health_habits', 'pets', 'mess_order', 'punctuality', 'friends_social', 'alcohol', 'driving', 'other')),
	CONSTRAINT "conflict_content_hidden_ck" CHECK("hidden_issue" IS NULL OR "hidden_issue" IN ('power_control', 'caring', 'recognition', 'commitment', 'trust_integrity', 'acceptance', 'autonomy_freedom', 'closeness_distance', 'unclear'))
);
--> statement-breakpoint
CREATE TABLE `conflict_severity` (
	`conflict_id` text PRIMARY KEY NOT NULL,
	`peak_intensity` integer,
	`escalation_slope` text,
	`personalisation` text,
	`flooding_signs` text,
	`flooded` integer,
	`recovery_minutes` integer,
	`composite_severity` real,
	FOREIGN KEY (`conflict_id`) REFERENCES `conflict_event`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "conflict_severity_slope_ck" CHECK("escalation_slope" IS NULL OR "escalation_slope" IN ('slow', 'gradual', 'rapid')),
	CONSTRAINT "conflict_severity_personal_ck" CHECK("personalisation" IS NULL OR "personalisation" IN ('issue_focused', 'drifted', 'personal'))
);
--> statement-breakpoint
CREATE TABLE `conflict_behaviour` (
	`conflict_id` text PRIMARY KEY NOT NULL,
	`horsemen` text,
	`contempt_present` integer,
	`antidotes` text,
	`own_contribution` text,
	FOREIGN KEY (`conflict_id`) REFERENCES `conflict_event`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `conflict_cycle` (
	`conflict_id` text PRIMARY KEY NOT NULL,
	`own_role` text,
	`partner_role` text,
	`cycle_type` text,
	`secondary_emotion` text,
	`primary_emotion` text,
	`attachment_need` text,
	`need_voiced` integer,
	FOREIGN KEY (`conflict_id`) REFERENCES `conflict_event`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "conflict_cycle_own_role_ck" CHECK("own_role" IS NULL OR "own_role" IN ('pursue', 'withdraw', 'alternating', 'unclear')),
	CONSTRAINT "conflict_cycle_partner_role_ck" CHECK("partner_role" IS NULL OR "partner_role" IN ('pursue', 'withdraw', 'alternating', 'unclear')),
	CONSTRAINT "conflict_cycle_type_ck" CHECK("cycle_type" IS NULL OR "cycle_type" IN ('pursue_withdraw', 'withdraw_pursue', 'attack_attack', 'withdraw_withdraw', 'mixed')),
	CONSTRAINT "conflict_cycle_secondary_ck" CHECK("secondary_emotion" IS NULL OR "secondary_emotion" IN ('anger', 'irritation', 'frustration', 'coldness', 'contempt', 'indifference', 'anxiety')),
	CONSTRAINT "conflict_cycle_primary_ck" CHECK("primary_emotion" IS NULL OR "primary_emotion" IN ('hurt', 'fear', 'loneliness', 'shame', 'rejection', 'inadequacy', 'helplessness', 'feeling_unimportant', 'feeling_trapped')),
	CONSTRAINT "conflict_cycle_need_ck" CHECK("attachment_need" IS NULL OR "attachment_need" IN ('are_you_there_for_me', 'do_i_matter', 'do_you_respect_me', 'can_i_trust_you', 'do_i_get_to_be_me'))
);
--> statement-breakpoint
CREATE TABLE `conflict_attribution` (
	`conflict_id` text PRIMARY KEY NOT NULL,
	`initial_attribution` text,
	`reappraisal` text,
	`locus` text,
	`stability` text,
	`globality` text,
	`intentionality` text,
	`attribution_index` real,
	`reappraisal_completed` integer,
	FOREIGN KEY (`conflict_id`) REFERENCES `conflict_event`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "conflict_attribution_locus_ck" CHECK("locus" IS NULL OR "locus" IN ('partner', 'self', 'situation', 'both')),
	CONSTRAINT "conflict_attribution_stability_ck" CHECK("stability" IS NULL OR "stability" IN ('stable', 'unstable')),
	CONSTRAINT "conflict_attribution_globality_ck" CHECK("globality" IS NULL OR "globality" IN ('global', 'specific')),
	CONSTRAINT "conflict_attribution_intent_ck" CHECK("intentionality" IS NULL OR "intentionality" IN ('intentional', 'unintentional'))
);
--> statement-breakpoint
CREATE TABLE `conflict_repair` (
	`conflict_id` text PRIMARY KEY NOT NULL,
	`own_repair_attempt` integer,
	`own_repair_received` integer,
	`partner_repair_attempt` integer,
	`partner_repair_accepted` integer,
	`repair_types` text,
	`resolution` text,
	`reconnected` integer,
	`reconnected_at` integer,
	`time_to_repair_hours` real,
	`reconnection_ritual` text,
	`aftermath_completed` integer,
	FOREIGN KEY (`conflict_id`) REFERENCES `conflict_event`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "conflict_repair_resolution_ck" CHECK("resolution" IS NULL OR "resolution" IN ('resolved', 'de_escalated', 'parked', 'open', 'perpetual'))
);
--> statement-breakpoint
CREATE TABLE `positive_event` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`occurred_at` integer NOT NULL,
	`type` text NOT NULL,
	`note` text,
	`expressed_to_partner` integer NOT NULL,
	`intensity` integer NOT NULL,
	`weight` real,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "positive_event_type_ck" CHECK("type" IS NULL OR "type" IN ('appreciation', 'affection', 'turned_toward', 'shared_humour', 'act_of_service', 'felt_close', 'shared_meaning', 'sexual_intimacy', 'support_received', 'support_given'))
);
--> statement-breakpoint
CREATE TABLE `perpetual_theme` (
	`id` text PRIMARY KEY NOT NULL,
	`relationship_id` text NOT NULL,
	`label` text,
	`dominant_hidden_issue` text,
	`conflict_count` integer,
	`first_seen` text,
	`last_seen` text,
	`classification` text,
	`intensity_trend` text,
	`dreams_explored` integer,
	`own_dream` text,
	`own_core_need` text,
	`acceptance_track_active` integer,
	FOREIGN KEY (`relationship_id`) REFERENCES `relationship`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "perpetual_theme_hidden_ck" CHECK("dominant_hidden_issue" IS NULL OR "dominant_hidden_issue" IN ('power_control', 'caring', 'recognition', 'commitment', 'trust_integrity', 'acceptance', 'autonomy_freedom', 'closeness_distance', 'unclear')),
	CONSTRAINT "perpetual_theme_class_ck" CHECK("classification" IS NULL OR "classification" IN ('solvable', 'perpetual_dialogue', 'gridlocked')),
	CONSTRAINT "perpetual_theme_trend_ck" CHECK("intensity_trend" IS NULL OR "intensity_trend" IN ('rising', 'flat', 'falling'))
);
--> statement-breakpoint
CREATE TABLE `assessment_result` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`instrument` text NOT NULL,
	`taken_at` integer NOT NULL,
	`raw_responses` text,
	`score` real,
	`subscales` text,
	`band` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "assessment_instrument_ck" CHECK("instrument" IS NULL OR "instrument" IN ('csi16', 'ecr_s', 'safety_screen', 'custom')),
	CONSTRAINT "assessment_band_ck" CHECK("band" IS NULL OR "band" IN ('low', 'moderate', 'high'))
);
--> statement-breakpoint
CREATE TABLE `ritual_instance` (
	`id` text PRIMARY KEY NOT NULL,
	`relationship_id` text NOT NULL,
	`ritual_type` text NOT NULL,
	`scheduled_for` integer,
	`completed_at` integer,
	`completed_by` text,
	`quality_rating` integer,
	FOREIGN KEY (`relationship_id`) REFERENCES `relationship`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "ritual_type_ck" CHECK("ritual_type" IS NULL OR "ritual_type" IN ('stress_reducing_conversation', 'state_of_union', 'six_second_kiss', 'departure_ritual', 'reunion_ritual', 'weekly_date', 'appreciation_daily')),
	CONSTRAINT "ritual_completed_by_ck" CHECK("completed_by" IS NULL OR "completed_by" IN ('me', 'both', 'neither'))
);
--> statement-breakpoint
CREATE TABLE `shared_item` (
	`id` text PRIMARY KEY NOT NULL,
	`from_user_id` text NOT NULL,
	`to_user_id` text NOT NULL,
	`source_type` text NOT NULL,
	`source_id` text NOT NULL,
	`payload` text,
	`shared_at` integer,
	`withdrawn_at` integer,
	`viewed` integer,
	CONSTRAINT "shared_item_source_ck" CHECK("source_type" IS NULL OR "source_type" IN ('conflict_disclosure', 'cycle_map', 'positive_event', 'appreciation', 'ritual', 'dream'))
);
--> statement-breakpoint
CREATE TABLE `intervention_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`trigger_rule` text NOT NULL,
	`intervention` text NOT NULL,
	`surfaced_at` integer NOT NULL,
	`engaged_at` integer,
	`completed_at` integer,
	`outcome` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "intervention_kind_ck" CHECK("intervention" IS NULL OR "intervention" IN ('self_soothe', 'softened_startup', 'aftermath', 'dreams', 'acceptance_track', 'ratio_nudge', 'contempt_alert', 'professional_referral', 'crisis_resources')),
	CONSTRAINT "intervention_outcome_ck" CHECK("outcome" IS NULL OR "outcome" IN ('completed', 'dismissed', 'snoozed'))
);
