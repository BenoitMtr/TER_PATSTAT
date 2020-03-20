/****** Object:  Table [dbo].[tls801_country]    Script Date: 07/07/2015 08:13:34 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls801_country(
	`ctry_code` char(2) NOT NULL DEFAULT '',
	`iso_alpha3` char(3) NOT NULL DEFAULT '',
	`st3_name` varchar(100) NOT NULL DEFAULT '',
	`state_indicator` char(1) NOT NULL DEFAULT '',
	`continent` varchar(25) NOT NULL DEFAULT '',
	`eu_member` char(1) NOT NULL DEFAULT '',
	`epo_member` char(1) NOT NULL DEFAULT '',
	`oecd_member` char(1) NOT NULL DEFAULT '',
	`discontinued` char(1) NOT NULL DEFAULT '',
PRIMARY KEY 
(
	`ctry_code` ASC
) 
);

