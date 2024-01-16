CREATE TABLE `link_timeseries` (
	`id` text PRIMARY KEY NOT NULL,
	`link_id` text NOT NULL,
	`visits` integer DEFAULT 0 NOT NULL,
	`visit_datetime` text NOT NULL,
	FOREIGN KEY (`link_id`) REFERENCES `links`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `link_id_idx` ON `link_timeseries` (`link_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `link_timeseries_link_id_visit_datetime_unique` ON `link_timeseries` (`link_id`,`visit_datetime`);