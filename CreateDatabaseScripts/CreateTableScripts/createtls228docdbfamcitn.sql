/****** Object:  Table [dbo].[tls228_docdb_fam_citn]    Script Date: 07/07/2015 18:32:52 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls228_docdb_fam_citn(
	`docdb_family_id` int NOT NULL DEFAULT '0',
	`cited_docdb_family_id` int NOT NULL DEFAULT '0',
PRIMARY KEY 
(
	`docdb_family_id` ASC,
	`cited_docdb_family_id` ASC
) 
);
