const sqlite = require('sqlite3').verbose();

//open the db
let db = new sqlite.Database('./db/workouts.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("connected to the workouts db");
})

let sql = 'SELECT * FROM comptrain';

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row);
    })
})