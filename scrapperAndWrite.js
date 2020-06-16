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
                'CREATE TABLE IF NOT EXISTS comptrain (date DATE, workout TEXT)', (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    console.log("Table successfuly opened or created");

                    checkDate((rowDate) => {
                        if (todaysDate() != rowDate ) {
                            console.log(`Today: ${todaysDate()}`);
                            console.log(`Last Date in DB: ${rowDate}`);
                            insertRow();
                        } else {
                            console.log('Workout for today is already in the database :)');
                        }
                    });
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

        // check if workout for today is already stored in the db
        function checkDate(callback) {

            // get last entry
            let sql = 'SELECT date FROM comptrain ORDER BY rowid DESC LIMIT 1'
            db.get(sql, [], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                const rowDate = row.date;
                callback(rowDate);
            });
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

        // getData
        app.get('getData', (req, res) => {
            fs.readFile("./public/forStyle.html", null, (err, data) => {
                if (err) {
                    res.status(404).send('File not found');
                } else {
                    console.log("connection to HTML established");
                }
            })
            app.use(express.static('public'));
        })


        // Start the server
        app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
        })

        // close Server automatically after Workout is written in the DB

    .catch(err => {
        // handle error
        console.log("Cannot reach Comptrain");
        console.log(err);
    });