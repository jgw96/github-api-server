"use strict";
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const github = require("octonode");
const winston = require("winston");

let client;
let ghme;

//test route
app.get('/test', (req, res) => {
    res.send('Hello World!');
});

//auth route
app.post("/auth", (req, res) => {
    client = github.client({
        username: req.body.username,
        password: req.body.password
    });
    
    ghme = client.me();

    ghme.info((err, data, headers) => {
        if (err) {
            winston.log("info", err);
        }
        else {
            res.send(data);
        }
    });
});

//follow someone
app.post("/follow", (req, res) => {
    ghme.follow(req.body.name);
    res.send({message: `${req.body.name} followed`});
    winston.log("info", `${req.body.name} followed`);
});

//unfollow
app.post("/unfollow", (req, res) => {
    ghme.unfollow(req.body.name);
    res.send({message: `${req.body.name} unfollowed`});
    winston.log("info", `${req.body.name} unfollowed`);
});

//get starred repos
app.get("/starred", (req, res) => {
    ghme.starred((err, data, headers) => {
        if (err) {
            winston.log("info", err);
        }
        else {
            res.send(data);
        }
    });
});

//star a repo
app.post("/star", (req, res) => {
    ghme.star(req.body.name);
    res.send({message: `${req.body.name} starred`});
    winston.log("info", `${req.body.name} starred`);
});

//unstar a repo
app.post("/unstar", (req, res) => {
    ghme.unstar(req.body.name);
    res.send({message: `${req.body.name} unstarred`});
    winston.log("info", `${req.body.name} unstarred`);
});

//get my repos
app.get("/myrepos", (req, res) => {
    ghme.repos((err, data, headers) => {
        if (err) {
            winston.log("info", err);
        }
        else {
            res.send(data);
        }
    });
});

app.listen(8080, () => {
    winston.log("info", 'Example app listening on port 8080!');
});