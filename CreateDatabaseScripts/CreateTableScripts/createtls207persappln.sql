/****** Object:  Table [dbo].[tls207_pers_appln]    Script Date: 07/07/2015 08:18:39 ******/
/* SET ANSI_NULLS ON */
 
/* SET QUOTED_IDENTIFIER ON */
 
CREATE TABLE tls207_pers_appln(
	`person_id` int NOT NULL DEFAULT '0',
	`appln_id` int NOT NULL DEFAULT '0',
	`applt_seq_nr` smallint NOT NULL DEFAULT '0',
	`invt_seq_nr` smallint NOT NULL DEFAULT '0',
PRIMARY KEY  
(
	`person_id` ASC,
	`appln_id` ASC,
	`applt_seq_nr` ASC,
	`invt_seq_nr` ASC
)
) 
