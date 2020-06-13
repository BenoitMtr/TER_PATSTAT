const mysql = require('mysql');
const tunnel = require("tunnel-ssh");
const { formatTime } = require("./toolbox.js");

// Same as having this in terminal but in one script
//ssh -N -L 33033:127.0.0.1:3306 database
// Unwrapped version
//ssh -N -L 33033:127.0.0.1:3306 user@database.com -o "ProxyCommand ssh user@bastion.com -i c:/Users/User/.ssh/id_rsa -W %h:22"
// And connect mysql to 127.0.0.1:33033

module.exports = cred => (reqs, res) => new Promise((resolve, reject) => {
    let finished = 0;
    const d1 = new Date();
    const tunnelPort = 33e3 + Math.floor(Math.random() * 1e3);
    const conn1 = tunnel({
        host: cred.bastion_host,
        username: cred.user,
        password: cred.user,
        privateKey: cred.privateKey,
        passphrase: cred.passphrase,
        localPort: tunnelPort,
        port: 22,
        dstHost: cred.db_host,
        dstPort: 3306,
        keepAlive: true
    }, err => {
        if (err) {
            conn1.close();
            return reject({ desc: "connection error", err });
        }
        const db = mysql.createConnection({
            host: "127.0.0.1",
            user: cred.db_user,
            password: cred.db_pass,
            database: "patstat",
            port: tunnelPort
        });
        const end = _ => {
            conn1.close();
            db.end();
        };
        db.on("error", err => reject({ desc: "db error", err }));
        db.connect(async err => {
            if (err) {
                reject({ desc: "mysql error", err });
                return end();
            }
            process.stdout.write(`req : 0/${reqs.length}\r`);
            try {
                await Promise.all(reqs.map(q => new Promise((resolve, reject) =>
                    db.query(q.req, (err, query_result) => {
                        if (err)
                            return reject(err);
                        q.callback(res, query_result);
                        resolve();
                        process.stdout.write(`req : ${finished++}/${reqs.length}\r`);
                    })
                )));
            } catch (Perr) {
                end();
                return reject({ desc: "query error", err: Perr });
            }
            end();
            console.log("Time spent", formatTime(new Date() - d1));
            resolve(res);
        });
    });
    conn1.on("error", err => {
        end();
        reject({ desc: "tunnel error", err });
    });
});