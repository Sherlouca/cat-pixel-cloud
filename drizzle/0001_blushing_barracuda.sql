CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`wallpaperId` varchar(64) NOT NULL,
	`wallpaperUrl` text NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
