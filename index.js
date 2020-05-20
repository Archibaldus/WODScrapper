const rp = require('request-promise');
const $ = require('cheerio');
const http = require('http');
const fs = require('fs');
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


