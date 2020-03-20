/****** Object:  Table [dbo].[tls216_appln_contn]    Script Date: 07/07/2015 08:21:31 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls216_appln_contn(
	`appln_id` int NOT NULL DEFAULT '0',
	`parent_appln_id` int NOT NULL DEFAULT '0',
	`contn_type` char(3) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`APPLN_ID` ASC,
	`PARENT_APPLN_ID` ASC
) 
);
