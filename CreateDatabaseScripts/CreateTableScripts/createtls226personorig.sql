/****** Object:  Table [dbo].[tls226_person_orig]    Script Date: 02/03/2016 04:32:25 ******/
/* SET ANSI_NULLS ON */
 

/* SET QUOTED_IDENTIFIER ON */
 

CREATE TABLE tls226_person_orig(
	`person_orig_id` int NOT NULL DEFAULT '0',
	`person_id` int NOT NULL DEFAULT '0',
	`source` char(5) NOT NULL DEFAULT '',
	`source_version` varchar(10) NOT NULL DEFAULT '',
	`name_freeform` nvarchar(500) NOT NULL DEFAULT '',
	`last_name` nvarchar(500) NOT NULL DEFAULT '',
	`first_name` nvarchar(500) NOT NULL DEFAULT '',
	`middle_name` nvarchar(500) NOT NULL DEFAULT '',
	`address_freeform` nvarchar(1000) NOT NULL DEFAULT '',
	`address_1` nvarchar(500) NOT NULL DEFAULT '',
	`address_2` nvarchar(500) NOT NULL DEFAULT '',
	`address_3` nvarchar(500) NOT NULL DEFAULT '',
	`address_4` nvarchar(500) NOT NULL DEFAULT '',
	`address_5` nvarchar(500) NOT NULL DEFAULT '',
	`street` nvarchar(500) NOT NULL DEFAULT '',
	`city` nvarchar(200) NOT NULL DEFAULT '',
  	`zip_code` nvarchar(30) NOT NULL DEFAULT '',
	`state` char(2) NOT NULL DEFAULT '',
	`person_ctry_code` char(2) NOT NULL DEFAULT '',
	`residence_ctry_code` char(2) NOT NULL DEFAULT '',
	`role` varchar(2) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`person_orig_id` ASC
) 
);





