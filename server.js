const $ = require('cheerio');
const fs = require('fs');

const sqlite = require('sqlite3').verbose();

const express = require('express');
const app = express();
const port = 8000;


 


function selectEntries (cb) {

    // Connect to DB
    let db = new sqlite.Database('./db/workouts.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the workouts database');
    });   

    // SELECT all rows
    let sql = 'SELECT * FROM comptrain';
    const listOfWODs = [];

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            listOfWODs.push(row);
        });
        //console.log(listOfWODs);
        db.close();
        cb(listOfWODs);
    });
}



function HTMLFile () {
    wodDates = [];
    myWods = [];
    selectEntries((listOfWODs) => {
        listOfWODs.forEach((obj) => {
            wodDates.push(obj.date);
            myWods.push(obj.workout);
        })
    })

    app.get('/', (req, res) => {
        res.render("home.ejs", {myWods: myWods,
        wodDates: wodDates});
    });




    // Start the server
    app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
    }

HTMLFile();