const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const server = require('http').Server(app);
const mysql = require('mysql');
const fetch = require('node-fetch');

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

app.get('/api/getNuts', (_, res) => {
    res.setHeader('Content-Type', 'text/json');
    db_con.query("SELECT n.nuts as code, n.nuts_label as label FROM tls904_nuts as n WHERE n.nuts_level = 0", (err, result) => {
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
        res.send(txt);
    } catch (err) {
        error(err);
        res.statusCode = 500;
        res.send("{ error : '" + err + "'}");
    }
});