/****** Object:  Table [dbo].[tls209_appln_ipc]    Script Date: 07/07/2015 08:19:22 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls209_appln_ipc(
	`appln_id` int NOT NULL DEFAULT '0',
	`ipc_class_symbol` varchar(15) NOT NULL DEFAULT '',
	`ipc_class_level` char(1) NOT NULL DEFAULT '',
	`ipc_version` date NOT NULL DEFAULT '9999-12-31',
	`ipc_value` char(1) NOT NULL DEFAULT '',
	`ipc_position` char(1) NOT NULL DEFAULT '',
	`ipc_gener_auth` char(2) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`appln_id` ASC,
	`ipc_class_symbol` ASC
) 
);
