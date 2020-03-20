/****** Object:  Table [dbo].[tls230_appln_techn_field]    Script Date: 07/07/2015 08:19:22 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls230_appln_techn_field(
	`appln_id` int NOT NULL DEFAULT '0',
	`techn_field_nr` tinyint Unsigned NOT NULL DEFAULT '0',
	`weight` real NOT NULL DEFAULT 1,
PRIMARY KEY 
(
	`appln_id` ASC,
	`techn_field_nr` ASC
) 
);