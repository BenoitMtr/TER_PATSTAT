/****** Object:  Table [dbo].[tls203_appln_abstr]    Script Date: 07/07/2015 08:16:50 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls203_appln_abstr(
	`appln_id` int NOT NULL DEFAULT '0',
	`appln_abstract_lg` char(2) NOT NULL DEFAULT '',
	`appln_abstract` Longtext NOT NULL,
PRIMARY KEY 
(
	`appln_id` ASC
) 
); 