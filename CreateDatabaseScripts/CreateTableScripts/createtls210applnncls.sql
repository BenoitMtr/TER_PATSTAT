/****** Object:  Table [dbo].[tls210_appln_n_cls]    Script Date: 16/03/2018 08:19:52 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls210_appln_n_cls(
	`appln_id` int NOT NULL DEFAULT '0',
	`nat_class_symbol` nvarchar(15) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`appln_id` ASC,
	`nat_class_symbol` ASC
) 
);
