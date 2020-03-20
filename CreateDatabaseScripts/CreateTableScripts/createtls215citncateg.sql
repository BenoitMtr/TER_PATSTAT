/****** Object:  Table [dbo].[tls215_citn_categ]    Script Date: 16/03/2018 18:00:00 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls215_citn_categ(
	`pat_publn_id` int NOT NULL DEFAULT '0',
	`citn_replenished` int NOT NULL DEFAULT '0',
	`citn_id` smallint NOT NULL DEFAULT '0',
	`citn_categ` nchar(1) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`pat_publn_id` ASC,
	`citn_replenished` ASC,
	`citn_id` ASC,
	`citn_categ` ASC
) 
);
