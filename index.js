const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const sqlite = require('sqlite3').verbose();

const express = require('express');
const app = express();
const port = 8000;


const url = 'https://comptrain.co/wod/'

rp(url)
    .then(html => {
        // success
        // console.log($('.wod-date', html).text());
        // console.log($('.wod-info', html).text());
        htmlOP = ($('.col-md-6', html).html());
 
        htmlOPString = $('p', htmlOP).text();
        console.log(htmlOPString.split("\n")); // work!

        // todays Date
        function todaysDate() {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();
            return todaysDateString = dd + '/' + mm + '/' + yyyy;
        }
        


        // Database Part
        let db = new sqlite.Database('./db/workouts.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the workouts database');
        });

        // create Table function
        function createTable() {
            db.run(
                'CREATE TABLE IF NOT EXISTS comptrain (date TEXT, workout TEXT)', (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    console.log("Table successfuly opened or created");
                    // first it has to be checked if a row with todaysDate is already in the DB
                    insertRow();
                }
            );
        }

        // insert row into the comptrain table function
        function insertRow() {
            db.run(
                'INSERT INTO comptrain VALUES(?, ?)', [todaysDate(), htmlOPString], (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    console.log('Row was added to the table');
                }
            );
        }

        // run creating and inserting
        createTable();

        

        

        // close DB connection
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the db connection');
        });

        // Split htmlOP for better DB Design
        // Date, Workout
        

        // Root
        app.get('/', (req, res) => {
            fs.readFile("./public/forStyle.html", null, (err, data) => {
                if (err) {
                    res.status(404).send('File not found');
                } else {
                    data += htmlOP;
                    res.send(data);
                }
            })
            app.use(express.static('public'));
        })
        

        // Start the server
        app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
    })
    .catch(err => {
        // handle error
        console.log("Cannot reach Comptrain");
        console.log(err);
    });


