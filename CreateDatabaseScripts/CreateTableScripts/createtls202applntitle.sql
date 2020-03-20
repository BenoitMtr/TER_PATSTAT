/****** Object:  Table [dbo].[tls202_appln_title]    Script Date: 07/07/2015 08:16:03 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls202_appln_title(
	`appln_id` int NOT NULL DEFAULT '0',
	`appln_title_lg` char(2) NOT NULL DEFAULT '',
	`appln_title` Longtext NOT NULL,
PRIMARY KEY 
(
	`appln_id` ASC
) 
);
