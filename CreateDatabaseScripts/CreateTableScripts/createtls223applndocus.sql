/****** Object:  Table [dbo].[tls223_appln_docus]    Script Date: 07/07/2015 04:32:25 ******/
/* SET ANSI_NULLS ON */
 

/* SET QUOTED_IDENTIFIER ON */
 

CREATE TABLE tls223_appln_docus(
	`appln_id` int NOT NULL DEFAULT '0',
	`docus_class_symbol` varchar(50) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`appln_id` ASC,
	`docus_class_symbol` ASC
) 
);


