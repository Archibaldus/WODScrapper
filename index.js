const rp = require('request-promise');
const $ = require('cheerio');
const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 8000:


const url = 'https://comptrain.co/wod/'

rp(url)
    .then(html => {
        // success
        // console.log($('.wod-date', html).text());
        // console.log($('.wod-info', html).text());
        htmlOP = ($('.col-md-6', html).html());
        
        // server 
        const handleReq = (req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            fs.readFile("forStyle.html", null, function (err, data) {
                fs.readFile("style.css", null, (err1, data1) => {
                    data += `<style>${data1}</style>`;
                    if (err) {
                        res.writeHead(404);
                        res.write("File not found!");
                    } else {
                        res.write(data);
                        res.write(htmlOP);
                    }
                    res.end();
                })

            });
        };

        http.createServer(handleReq).listen(8000);
        console.log("Server has startet on Port 8000");
    })
    .catch(err => {
        // handle error
        console.log("Cannot reach Comptrain");
        console.log(err);
    });


