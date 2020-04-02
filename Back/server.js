const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const server = require('http').Server(app);
const mysql = require('mysql');
const fetch = require('node-fetch');

// On http://nuts.geovocab.org/id/nuts0.html <= replace 0 with nuts_level
// (_=>{const c=[];document.querySelectorAll('tr td:first-child a').forEach(e=>c.push(e.innerHTML.substring(0,e.innerHTML.indexOf(' '))));console.log(c.join("','"));})()
const nuts_gps = require('./nuts_gps');

const { log, error } = console;

const db_con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'patstat2018b'
});

db_con.connect(err => {
    if (err)
        error(err);
    else
        log("Mysql connected !");
});

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", ["*"]);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

// Lance le serveur avec express
server.listen(port);
log("Serveur lancé sur le port : " + port);

app.get('/api/getNuts/:level?/:code?', (req, res) => {
    const level = Number(req.params.level) || 0;
    const code = req.params.code || "";

    const sql = `SELECT n.nuts as code, n.nuts_label as label, n.nuts_level as level, (
        SELECT COUNT(subnut.nuts) AS total
        FROM tls904_nuts AS subnut
        WHERE subnut.nuts_level = ${level+1}
        AND subnut.nuts LIKE CONCAT(n.nuts, '%')
        AND subnut.nuts IN ('${nuts_gps[level+1].join("','")}')
        ) as nb_subnut
        FROM tls904_nuts as n
        WHERE n.nuts_level = ${level}
        AND n.nuts like '${code}%'
        AND n.nuts IN ('${nuts_gps[level].join("','")}')`;

    res.setHeader('Content-Type', 'text/json');
    db_con.query(sql, (err, result) => {
        if (err) {
            error(err);
            res.statusCode = 500;
            res.send("{ error : '" + err + "'}");
        } else {
            res.statusCode = 200;
            res.send(JSON.stringify(result));
        }
    });
});

app.get('/api/getGeometry/:code', async (req, res) => {
    try {
        const b = await fetch(`http://nuts.geovocab.org/id/${req.params.code}_geometry.kml`);
        const txt = await b.text();
        res.statusCode = 200;
        res.send(txt);
    } catch (err) {
        error(err);
        res.statusCode = 500;
        res.send("{ error : '" + err + "'}");
    }
});