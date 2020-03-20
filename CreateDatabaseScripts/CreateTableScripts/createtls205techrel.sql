/****** Object:  Table [dbo].[tls205_tech_rel]    Script Date: 07/07/2015 08:17:51 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls205_tech_rel(
	`appln_id` int NOT NULL DEFAULT '0',
	`tech_rel_appln_id` int NOT NULL DEFAULT '0',
PRIMARY KEY 
(
	`appln_id` ASC,
	`tech_rel_appln_id` ASC
) 
);
