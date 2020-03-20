/****** Object:  Table [dbo].[tls206_person]    Script Date: 02/03/2016 08:18:13 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls206_person(
	`person_id` int NOT NULL DEFAULT '0',
	`person_name` nvarchar(500) NOT NULL DEFAULT '',
	`person_address` nvarchar(1000) NOT NULL DEFAULT '',
	`person_ctry_code` char(2) NOT NULL DEFAULT '',
	`doc_std_name_id` int NOT NULL DEFAULT '0',
	`doc_std_name` nvarchar(500)  NOT NULL DEFAULT '',
	`psn_id` int NOT NULL DEFAULT '0',
	`psn_name` nvarchar(500) NOT NULL DEFAULT '',
	`psn_level` tinyint Unsigned NOT NULL DEFAULT '0',
	`psn_sector` varchar(50) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`person_id` ASC
) 
);
