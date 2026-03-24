PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_list_todos` (
	`list_id` text NOT NULL,
	`todo_id` text NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`list_id`, `todo_id`),
	FOREIGN KEY (`list_id`) REFERENCES `lists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`todo_id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_list_todos`("list_id", "todo_id", "position") SELECT "list_id", "todo_id", "position" FROM `list_todos`;--> statement-breakpoint
DROP TABLE `list_todos`;--> statement-breakpoint
ALTER TABLE `__new_list_todos` RENAME TO `list_todos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;