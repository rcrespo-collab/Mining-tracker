PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_intervention_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`trigger_rule` text NOT NULL,
	`intervention` text NOT NULL,
	`surfaced_at` integer NOT NULL,
	`engaged_at` integer,
	`completed_at` integer,
	`outcome` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "intervention_kind_ck" CHECK("intervention" IS NULL OR "intervention" IN ('self_soothe', 'softened_startup', 'aftermath', 'dreams', 'acceptance_track', 'ratio_nudge', 'contempt_alert', 'professional_referral', 'crisis_resources', 'repair_followup', 'trigger_insight', 'reengagement', 'perpetual_reframe')),
	CONSTRAINT "intervention_outcome_ck" CHECK("outcome" IS NULL OR "outcome" IN ('completed', 'dismissed', 'snoozed'))
);
--> statement-breakpoint
INSERT INTO `__new_intervention_log`("id", "user_id", "trigger_rule", "intervention", "surfaced_at", "engaged_at", "completed_at", "outcome") SELECT "id", "user_id", "trigger_rule", "intervention", "surfaced_at", "engaged_at", "completed_at", "outcome" FROM `intervention_log`;--> statement-breakpoint
DROP TABLE `intervention_log`;--> statement-breakpoint
ALTER TABLE `__new_intervention_log` RENAME TO `intervention_log`;--> statement-breakpoint
PRAGMA foreign_keys=ON;