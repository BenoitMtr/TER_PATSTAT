const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const server = require('http').Server(app);
const mysql = require('mysql');
const fetch = require('node-fetch');
const fs = require("fs");

// On http://nuts.geovocab.org/id/nuts0.html <= replace 0 with nuts_level
// (_=>{const c=[];document.querySelectorAll('tr td:first-child a').forEach(e=>c.push(e.innerHTML.substring(0,e.innerHTML.indexOf(' '))));console.log(c.join("','"));})()
const nuts_gps = require('./nuts_gps');

const { log, error } = console;

const db_con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ter_patstat',
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

// Files from
// https://ec.europa.eu/eurostat/web/gisco/geodata/reference-data/administrative-units-statistical-units/nuts
// openlayers use EPSG:3857 coordinates
// 2 types :  LB (points) - RG (polygon)
app.get("/api/getGeoJson/LB/:level?", (req, res) => readSendJSON(res, `geojson2016/NUTS_LB_2016_3857_LEVL_${Number(req.params.level) || 0}.geojson`));
// 1m = max quality - 60m lowest quality
// [1,3,10,20,60]m
app.get("/api/getGeoJson/RG/:level?", (req, res) => readSendJSON(res, `geojson2016/NUTS_RG_60M_2016_3857_LEVL_${Number(req.params.level) || 0}.geojson`));

app.get('/api/getNuts/:level?/:code?', (req, res) => {
    const level = Number(req.params.level) || 0;
    const code = req.params.code || "";

    querySendSQL(res,
        `SELECT n.nuts as code, n.nuts_label as label, n.nuts_level as level, (
        SELECT COUNT(subnut.nuts) AS total
        FROM tls904_nuts AS subnut
        WHERE subnut.nuts_level = ${level+1}
        AND subnut.nuts LIKE CONCAT(n.nuts, '%')
        ) as nb_subnut, (
            SELECT code IN ('${nuts_gps[level].join("','")}')
        ) as has_gps
        FROM tls904_nuts as n
        WHERE n.nuts_level = ${level}
        AND n.nuts like '${code}%'`
    );
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

app.get('/api/getBrevets/:code', async (req, res) => {
    querySendSQL(res,
        `SELECT c.person_name, c.nuts, c.nuts_level, t.appln_title, a.* 
        FROM tls201_appln a
        INNER JOIN tls207_pers_appln b ON a.appln_id=b.appln_id
        INNER JOIN tls202_appln_title t ON a.appln_id=t.appln_id
        INNER JOIN tls906_person c ON b.person_id=c.person_id
        WHERE c.nuts like '${req.params.code}%'`
    );
});

function readSendJSON(res, fileName) {
    res.setHeader('Content-Type', 'application/json');
    fs.readFile(fileName, (err, data) => sendRes(res, err, data));
}

function querySendSQL(res, sql) {
    res.setHeader('Content-Type', 'application/json');
    db_con.query(sql, (err, result) => sendRes(res, err, JSON.stringify(result)));
}

function sendRes(res, err, data) {
    if (err) {
        error(err);
        res.statusCode = 500;
        res.send(`{'error':'${err}'}`);
    } else {
        res.statusCode = 200;
        res.send(data);
    }
}