import express from 'express';

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    const d = new Date();
    let day = weekday[d.getDay()];
    let month = months[d.getMonth()];
    let date = d.getDate();
    let todaysDate = `${day}, ${month} ${date}`;
    res.render("index.ejs", {nowDate: todaysDate, allNotes: notes});
})

app.post("/", (req, res) => {
    var note = req.body.newNote;
    notes.push(note);
    res.redirect(("/"));
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var notes = [];