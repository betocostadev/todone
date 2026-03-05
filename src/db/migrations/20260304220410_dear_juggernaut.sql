CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`title` text(128) NOT NULL,
	`note` text(512),
	`due_date` integer,
	`due_time` text,
	`recurrence_type` text,
	`recurrence_interval` integer,
	`recurrence_weekdays` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`completed_at` integer,
	`deleted_at` integer,
	`purge_after` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(64) NOT NULL,
	`icon` text,
	`color` text,
	`position` integer NOT NULL,
	`is_pinned` integer DEFAULT false,
	`is_system` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted_at` integer,
	`purge_after` integer
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(64) NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`todo_id` text NOT NULL,
	`notify_at` integer NOT NULL,
	`is_expired` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`todo_id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_title_unique` ON `tags` (`title`);--> statement-breakpoint
CREATE TABLE `todo_tags` (
	`todo_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`todo_id`, `tag_id`),
	FOREIGN KEY (`todo_id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `list_todos` (
	`list_id` text NOT NULL,
	`todo_id` text NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`list_id`, `todo_id`),
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`todo_id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade
);