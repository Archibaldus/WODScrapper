const sqlite = require('sqlite3').verbose();

//open the db
let db = new sqlite.Database('./db/workouts.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("connected to the workouts db");
})

// SELECT all rows
let sql = 'SELECT * FROM comptrain';

// print to the console
db.all(sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row);
    })
})

// close the db connection
db.close();