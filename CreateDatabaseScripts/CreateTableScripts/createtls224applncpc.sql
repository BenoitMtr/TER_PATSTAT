/****** Object:  Table [dbo].[tls224_appln_cpc]    Script Date: 07/07/2015 04:32:25 ******/
/* SET ANSI_NULLS ON */
 

/* SET QUOTED_IDENTIFIER ON */
 

CREATE TABLE tls224_appln_cpc(
	`appln_id` int NOT NULL DEFAULT '0',
	`cpc_class_symbol` varchar(19) NOT NULL DEFAULT '',
	`cpc_scheme` varchar(5) NOT NULL DEFAULT '',
	`cpc_version` date NOT NULL DEFAULT '9999-12-31',
	`cpc_value` char(1) NOT NULL DEFAULT '',
	`cpc_position` char(1) NOT NULL DEFAULT '',
	`cpc_gener_auth` char(2) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`appln_id` ASC,
	`cpc_class_symbol` ASC,
	`cpc_scheme` ASC
) 
);

