/****** Object:  Table [dbo].[tls229_appln_nace2]    Script Date: 07/07/2015 08:19:22 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls229_appln_nace2(
	`appln_id` int NOT NULL DEFAULT '0',
	`nace2_code` varchar(5) NOT NULL DEFAULT '',
	`weight` real NOT NULL DEFAULT 1,
PRIMARY KEY 
(
	`appln_id` ASC,
	`nace2_code` ASC
) 
);
