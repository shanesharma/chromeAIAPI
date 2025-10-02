const express = require("express");
const fs = require('fs')

const app = express();

//const text = (fs.readFile("/Users/shanesharma/Desktop/screenshots/test.PNG"));
app.use(express.static("public"))



app.get("/filedata", (req, res) => 
{
    res.sendFile("/Users/shanesharma/Desktop/screenshots/test.PNG")
})

app.listen(3000, () => console.log("hello"))