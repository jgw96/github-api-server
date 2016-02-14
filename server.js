"use strict";
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const github = require("octonode");
const winston = require("winston");

//configure winston
winston.add(winston.transports.File, { filename: 'logs.log'});

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
            winston.log("debug", err);
        }
        else {
            res.send(data);
        }
    });
});

//follow someone
app.post("/follow", (req, res) => {
    ghme.follow(req.body.name, (err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send({ message: `${req.body.name} followed` });
            winston.log("info", `${req.body.name} followed`);
        }
    });
});

//unfollow
app.post("/unfollow", (req, res) => {
    ghme.unfollow(req.body.name, (err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send({ message: `${req.body.name} unfollowed` });
            winston.log("info", `${req.body.name} unfollowed`);
        }
    });
});

//get starred repos
app.get("/starred", (req, res) => {
    ghme.starred((err, data, headers) => {
        if (err) {
            winston.log("info", err);
        }
        else {
            res.send(data);
            winston.log("info", "Got a users starred repos");
        }
    });
});

//star a repo
app.post("/star", (req, res) => {
    ghme.star(req.body.name, (err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send({ message: `${req.body.name} starred` });
            winston.log("info", `${req.body.name} starred`);
        }
    });
});

//unstar a repo
app.post("/unstar", (req, res) => {
    ghme.unstar(req.body.name, (err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send({ message: `${req.body.name} unstarred` });
            winston.log("info", `${req.body.name} unstarred`);
        }
    });
});

//get my repos
app.get("/myrepos", (req, res) => {
    ghme.repos(1, 200, (err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send(data);
            winston.log("info", "Got a users repos");
        }
    });
});

//make a new repo
app.post("/makerepo", (req, res) => {
    ghme.repo({
        "name": req.body.name,
        "description": req.body.description
    }, (err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send(data);
            winston.log("info", "Made a repo for a user");
        }
    });
});

//get users that I follow
app.get("/ifollow", (req, res) => {
    ghme.following((err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send(data);
            winston.log("info", "Got people that a user followed");
        }
    });
});

//get users following the authed user
app.get("/followme", (req, res) => {
    ghme.followers((err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send(data);
            winston.log("info", "Got users following the authed user");
        }
    });
});

//get info about the authed user
app.get("/me", (req, res) => {
    ghme.info((err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send(data);
            winston.log("info", "Got info about an authed user");
        }
    });
});

//get notifications
app.get("/notifications", (req, res) => {
    ghme.notifications({all: true, participating: false},(err, data, headers) => {
        if (err) {
            winston.log("debug", err);
        }
        else {
            res.send(data);
            winston.log("info", "Got notifications from a user");
        }
    });
});

app.listen(8080, () => {
    winston.log("info", 'Server started and listening on port 8080!');
});

