/****** Object:  Table [dbo].[tls901_techn_field_ipc]    Script Date: 07/07/2015 08:13:34 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls901_techn_field_ipc(
	`ipc_maingroup_symbol` varchar(8) NOT NULL DEFAULT '',
	`techn_field_nr` tinyint Unsigned NOT NULL DEFAULT '0',
	`techn_sector` varchar(50) NOT NULL DEFAULT '',
	`techn_field` varchar(50) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`ipc_maingroup_symbol` ASC	
) 
);

