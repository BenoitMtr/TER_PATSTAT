/****** Object:  Table [dbo].[tls227_pers_publn]    Script Date: 07/07/2015 04:32:25 ******/
/* SET ANSI_NULLS ON */
 

/* SET QUOTED_IDENTIFIER ON */
 

CREATE TABLE tls227_pers_publn(
	`person_id` int NOT NULL DEFAULT '0',
	`pat_publn_id` int NOT NULL DEFAULT '0',
	`applt_seq_nr` smallint NOT NULL DEFAULT '0',
	`invt_seq_nr` smallint NOT NULL DEFAULT '0',
PRIMARY KEY 
(
	`person_id` ASC,
	`pat_publn_id` ASC,
	`applt_seq_nr` ASC,
	`invt_seq_nr` ASC
)
) 