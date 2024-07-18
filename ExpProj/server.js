//jshint esversion:6 
const express = require('express');

const app = express();

app.get("/", (req, res) => 
res.send("<h1>hello</h1>"));

app.get("/contact", (req, res) => res.send("contact me at blah!"));

app.get("/about", (req,res) => res.send("this is all about blah!"));
app.listen(3003);