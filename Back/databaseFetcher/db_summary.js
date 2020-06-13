const disp = (name, table) => console.log(name) || console.table(table);
require("./fetchDatabase.js")(require("./cred.js"))([{
    req: `SELECT table_name AS "Table",
					FORMAT((data_length + index_length) / 1024 / 1024, 2) AS "Size (MB)",
					FORMAT(table_rows, 0) AS "Rows"
				FROM information_schema.TABLES
				WHERE table_schema="patstat" AND TABLE_NAME LIKE "tls%"
				ORDER BY (data_length + index_length) DESC`,
    callback: (_, t) => disp("Database summary", t)
}, {
    req: `SELECT a.year, a.nb_app, a.nb_app/c.total*100 AS ratio
				FROM (SELECT a.APPLN_FILING_YEAR AS year, COUNT(a.appln_id) AS nb_app
						FROM TLS201_APPLN a
						GROUP BY a.APPLN_FILING_YEAR
				) AS a,
				(SELECT COUNT(a.appln_id) AS total
					FROM TLS201_APPLN a
				) AS c
				`,
    callback: (_, t) => disp('Year : #ratio', t)
}, {
    req: `SELECT a.kind, a.nb_app, a.nb_app/c.total*100 AS ratio
				FROM (SELECT a.APPLN_KIND AS kind, COUNT(a.appln_id) AS nb_app
						FROM TLS201_APPLN a 
						GROUP BY a.APPLN_KIND
				) AS a,
				(SELECT COUNT(a.appln_id) AS total
					FROM TLS201_APPLN a
				) AS c
				`,
    callback: (_, t) => disp('Kind : #count', t)
}, {
    req: `SELECT p.person_ctry_code AS 'Country code',
					SUBSTRING(p.nuts, 1, 2) AS 'NUTS (first 2 characters)',
					FORMAT(COUNT(p.person_id), 0) AS 'Occurences'
				FROM TLS906_PERSON p
				WHERE p.person_ctry_code NOT LIKE SUBSTRING(p.nuts, 1, 2) AND p.nuts NOT LIKE ''
				GROUP BY p.person_ctry_code, SUBSTRING(p.nuts, 1, 2)`,
    callback: (res, query_result) => res.push({ name: 'Person country code != Person nuts', query_result })
}, {
    req: `SELECT FORMAT(COUNT(p.person_id), 0) AS 'Person without NUTS'
				FROM TLS906_PERSON p
				WHERE p.nuts LIKE ''`,
    callback: (_, t) => disp('Person without NUTS', t)
}, {
    req: `SELECT FORMAT(COUNT(p.person_id), 0) AS 'Person without country code'
				FROM TLS906_PERSON p
				WHERE p.person_ctry_code LIKE ''`,
    callback: (_, t) => disp('Person without country code', t)
}, {
    req: `SELECT FORMAT(COUNT(p.person_id), 0) AS 'Person without NUTS and country code'
				FROM TLS906_PERSON p
				WHERE p.person_ctry_code LIKE ''
				AND p.nuts LIKE ''`,
    callback: (_, t) => disp('Person without NUTS and country code', t)
}, {
    req: `SELECT FORMAT(COUNT(p.person_id), 0) AS 'Total person'
				FROM TLS906_PERSON p`,
    callback: (_, t) => disp('Number of person in the dataset', t)
}, {
    req: `SELECT n.nuts3_level AS 'Niveau NUTS',
				nb.total AS 'Total NUTS avec au moins 1 brevet',
				n.total AS 'Total NUTS',
				CONCAT(FORMAT(nb.total/n.total*100, 2),'%') AS 'Ratio'
			FROM (
				SELECT n.nuts3_level, COUNT(*) AS total
				FROM tls904_nuts n
				GROUP BY n.nuts3_level
			) AS n
			INNER JOIN (
				SELECT nuts.nuts3_level, COUNT(*) AS total
				FROM (
					SELECT n.nuts3, n.nuts3_level, (
						SELECT COUNT(DISTINCT a.appln_id) AS nb_brevet
						FROM TLS201_APPLN a
						INNER JOIN TLS207_PERS_APPLN b ON a.appln_id = b.appln_id
						INNER JOIN TLS906_PERSON c ON b.person_id = c.person_id
						WHERE c.nuts LIKE n.nuts3
					) AS nb_brevet
					FROM tls904_nuts n
					HAVING nb_brevet > 0
				) AS nuts
				GROUP BY nuts.nuts3_level
			) AS nb ON nb.nuts3_level = n.nuts3_level`,
    callback: (_, t) => disp('Nuts summary', t)
}], []).catch(console.error);