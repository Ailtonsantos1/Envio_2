CREATE TABLE `cidade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`uf_id` integer,
	FOREIGN KEY (`uf_id`) REFERENCES `uf`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `noticia` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`texto` text NOT NULL,
	`cidade_id` integer,
	`data_criacao` text DEFAULT '2026-04-04T06:23:32.433Z',
	FOREIGN KEY (`cidade_id`) REFERENCES `cidade`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `uf` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`sigla` text NOT NULL
);
