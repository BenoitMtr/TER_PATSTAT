/****** Object:  Table [dbo].[tls904_nuts]    Script Date: 02/28/2018 18:00:00 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls904_nuts(
	`nuts` varchar(5) NOT NULL DEFAULT '',
	`nuts_level` tinyint Unsigned NOT NULL DEFAULT '0',
	`nuts_label` nvarchar(250) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`nuts` ASC
) 
);

