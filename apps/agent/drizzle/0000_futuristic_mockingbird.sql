CREATE TABLE `context_mappings` (
	`context_id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `context_mappings_conversation_idx` ON `context_mappings` (`conversation_id`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`metadata` text
);
--> statement-breakpoint
CREATE INDEX `conversations_created_at_idx` ON `conversations` (`created_at`);--> statement-breakpoint
CREATE INDEX `conversations_updated_at_idx` ON `conversations` (`updated_at`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text,
	`actor` text NOT NULL,
	`content` text NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	`metadata` text,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `events_conversation_idx` ON `events` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `events_timestamp_idx` ON `events` (`timestamp`);--> statement-breakpoint
CREATE INDEX `events_actor_idx` ON `events` (`actor`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`message_id` text NOT NULL,
	`context_id` text,
	`task_id` text,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	`metadata` text,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `messages_message_id_unique` ON `messages` (`message_id`);--> statement-breakpoint
CREATE INDEX `messages_conversation_idx` ON `messages` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `messages_context_idx` ON `messages` (`context_id`);--> statement-breakpoint
CREATE INDEX `messages_task_idx` ON `messages` (`task_id`);--> statement-breakpoint
CREATE INDEX `messages_timestamp_idx` ON `messages` (`timestamp`);--> statement-breakpoint
CREATE TABLE `pending_messages` (
	`message_id` text PRIMARY KEY NOT NULL,
	`context_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pending_messages_context_idx` ON `pending_messages` (`context_id`);--> statement-breakpoint
CREATE TABLE `remote_agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`card` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`registered_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_seen` integer,
	`metadata` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `remote_agents_name_unique` ON `remote_agents` (`name`);--> statement-breakpoint
CREATE INDEX `remote_agents_name_idx` ON `remote_agents` (`name`);--> statement-breakpoint
CREATE INDEX `remote_agents_active_idx` ON `remote_agents` (`is_active`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text,
	`context_id` text,
	`state` text NOT NULL,
	`status_message` text,
	`history` text,
	`artifacts` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`metadata` text,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tasks_conversation_idx` ON `tasks` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `tasks_context_idx` ON `tasks` (`context_id`);--> statement-breakpoint
CREATE INDEX `tasks_state_idx` ON `tasks` (`state`);--> statement-breakpoint
CREATE INDEX `tasks_created_at_idx` ON `tasks` (`created_at`);