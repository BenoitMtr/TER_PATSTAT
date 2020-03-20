/****** Object:  Table [dbo].[tls906_person]    Script Date: 12/02/2016 08:18:13 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls906_person(
	`person_id` int NOT NULL DEFAULT '0',
	`person_name` nvarchar(500) NOT NULL DEFAULT '',
	`person_address` nvarchar(1000) NOT NULL DEFAULT '',
	`person_ctry_code` char(2) NOT NULL DEFAULT '',
	`nuts` varchar(5) NOT NULL DEFAULT '',
	`nuts_level` tinyint Unsigned NOT NULL DEFAULT '9',
	`doc_std_name_id` int NOT NULL DEFAULT '0',
	`doc_std_name` nvarchar(500) NOT NULL DEFAULT '',
	`psn_id` int NOT NULL DEFAULT '0',
	`psn_name` nvarchar(500) NOT NULL DEFAULT '',
	`psn_level` tinyint Unsigned NOT NULL DEFAULT '0',
	`psn_sector` varchar(50) NOT NULL DEFAULT '',
	`han_id` int NOT NULL DEFAULT '0',
	`han_name` nvarchar(500) NOT NULL DEFAULT '',
	`han_harmonized` int NOT NULL DEFAULT '0',
PRIMARY KEY 
(
	`person_id` ASC
) 
);
