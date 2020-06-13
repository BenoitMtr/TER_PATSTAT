const fs = require("fs");
const fetchDatabase = require("./fetchDatabase.js")(require("./cred.js"));

const outDir = "./out";
if (!fs.existsSync(outDir))
    fs.mkdirSync(outDir);

async function fetchAndWrite(fileName, reqs, startingState = {}) {
    if (!fs.existsSync(`${outDir}/${fileName}.json`)) {
        console.log(`Fetching ${fileName}.json`);
        try {
            const res = await fetchDatabase(reqs, startingState);
            fs.writeFileSync(`${outDir}/${fileName}.json`, JSON.stringify(res), err => {
                if (err) console.error(err);
            });
        } catch (err) {
            if (err.desc) console.error(err.desc, err.err);
            elseconsole.error("No desc", err);
            return;
        }
        console.log("Done !");
    }
    return require(`${outDir}/${fileName}.json`);
}

(async _ => {

    const nuts = await fetchAndWrite("nuts", [{
        req: `SELECT n.nuts3 AS code, n.nuts3_name AS name FROM tls904_nuts n WHERE n.nuts3_level = 0`,
        callback: (res, query_result) => JSON.parse(JSON.stringify(query_result)).forEach(o => res.push(o))
    }], []);

    await fetchAndWrite("nbBrevets", nuts.map(n => ({
        req: `SELECT a.APPLN_FILING_YEAR AS year,
						SUBSTRING(d.ipc_class_symbol, 1, 1) AS domain,
						COUNT(DISTINCT a.appln_id) AS nb_brevet
					FROM TLS201_APPLN a
					INNER JOIN TLS207_PERS_APPLN b ON a.appln_id = b.appln_id
					INNER JOIN TLS906_PERSON c ON b.person_id = c.person_id
					INNER JOIN TLS209_APPLN_IPC d ON a.appln_id = d.appln_id
					WHERE c.nuts LIKE '${n.code}%'
					AND a.APPLN_FILING_YEAR != 9999
					GROUP BY a.APPLN_FILING_YEAR, SUBSTRING(d.ipc_class_symbol, 1, 1)`,
        callback: (res, query_result) => {
            query_result.forEach(r => {
                const { domain } = r;
                const year = 'y' + r.year;
                if (!res[year]) res[year] = {};
                if (!res[year][domain]) res[year][domain] = {};
                res[year][domain][n.code] = r.nb_brevet;
            });
        }
    }), []));

    let fileName = "collab";
    if (!fs.existsSync(`${outDir}/${fileName}.json`)) {
        const magnitude = 6;
        const { range } = (await fetchDatabase([{
            req: `SELECT CEIL(MAX(a.appln_id) / POW(10, ${magnitude})) AS 'range' FROM TLS201_APPLN a`,
            callback: (res, query_result) => res.range = query_result[0].range
        }]));

        await fetchAndWrite(fileName, Array(range).fill(0).map((_, i) => ({
            req: `SELECT t.year, t.id, t.domain, COUNT(nuts_corr) AS nb_nuts,
			GROUP_CONCAT(nuts_corr SEPARATOR  ":") AS collab,
			GROUP_CONCAT(nb_person SEPARATOR  ":") AS nb_person_collab
			FROM (
				SELECT a.appln_id AS id, a.APPLN_FILING_YEAR AS year,
					substring(d.ipc_class_symbol, 1, 1) AS domain,
					substring(p.nuts, 1, 2) AS nuts_corr, COUNT(p.person_id) AS nb_person
				FROM TLS201_APPLN a
				INNER JOIN TLS207_PERS_APPLN pa ON a.appln_id = pa.appln_id
				INNER JOIN TLS906_PERSON p ON pa.person_id = p.person_id
				INNER JOIN TLS209_APPLN_IPC d ON a.appln_id = d.appln_id
				WHERE p.nuts != ''
				AND a.appln_id >= ${i}e${magnitude} AND a.appln_id < ${i+1}e${magnitude}
				AND a.APPLN_FILING_YEAR != 9999
				GROUP BY a.appln_id, nuts_corr
			) AS t
			GROUP BY t.id
			HAVING nb_nuts > 1
			ORDER BY t.year`,
            callback: (res, query_result) => {
                query_result.forEach(r => {
                    const d = r.domain;
                    const year = "y" + r.year;
                    const ctry = r.collab.split(":");
                    const nCola = r.nb_person_collab.split(":").map(Number);
                    ctry.forEach((c, i) => {
                        if (!res[year]) res[year] = {};
                        if (!res[year][d]) res[year][d] = {};
                        if (!res[year][d][c]) res[year][d][c] = {};
                        ctry.forEach(c2 => {
                            if (c != c2)
                                if (!res[year][d][c][c2]) res[year][d][c][c2] = nCola[i];
                                else res[year][d][c][c2] += nCola[i];
                        });
                    });
                });
            }
        })), {});
    }
})();