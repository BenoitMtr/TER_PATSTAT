/****** Object:  Table [dbo].[tls902_ipc_nace2]    Script Date: 02/16/2016 18:13:34 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls902_ipc_nace2(
	`ipc` varchar(8) NOT NULL DEFAULT '',
	`not_with_ipc` varchar(8) NOT NULL DEFAULT '',
	`unless_with_ipc` varchar(8) NOT NULL DEFAULT '',
	`nace2_code` varchar(5) NOT NULL DEFAULT '',
	`nace2_weight` tinyint Unsigned NOT NULL DEFAULT 1,
	`nace2_descr` varchar(150) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`ipc` ASC,
	`not_with_ipc` ASC,
	`unless_with_ipc` ASC,
	`nace2_code` ASC
) 
);

