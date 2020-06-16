const sqlite = require('sqlite3').verbose();

function todaysDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return todaysDateString = dd + '/' + mm + '/' + yyyy;
}


// console.log(todaysDate());



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

function checkDate() {

    // get last entry
    let sql = 'SELECT DISTINCT date FROM comptrain ORDER BY date DESC LIMIT 1'
    db.get(sql, [], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        // bekomme hier falsches Ergebniss
        const dateResult = row.date;
        return dateResult.slice(0, 10);
    })
}



// close the db connection
db.close();


