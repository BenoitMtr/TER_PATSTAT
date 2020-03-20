const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const server = require('http').Server(app);
const mysql = require('mysql');

const db_con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'patstat2018b'
});

db_con.connect(err => {
    if (err) throw err;
    console.log("Mysql connected !");
});

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", ["*"]);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");

    next();
});

// Lance le serveur avec express
server.listen(port);
console.log("Serveur lancé sur le port : " + port);

app.get('/api/getNuts', (_, res) => {
    res.setHeader('Content-Type', 'text/json');
    db_con.query("SELECT n.* FROM tls904_nuts as n", (err, result) => {
        if (err) {
            res.statusCode = 500;
            res.send("{ error : '" + err + "'}");
        } else {
            res.statusCode = 200;
            res.send(JSON.stringify(result));
        }
    });
});