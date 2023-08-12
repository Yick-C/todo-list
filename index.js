import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

// Setup items database and record schema
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
.then(function(){
    console.log("Connected successfully to the database!");
})
.catch(function(){
    console.log("Database connection failed");
});

// Create schema, model and default items
const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Press the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Press this to delete an item"
});

const defaultItems = [item1, item2, item3];

// Create list schema and model
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
    const d = new Date();
    let day = weekday[d.getDay()];
    let month = months[d.getMonth()];
    let date = d.getDate();
    let todaysDate = `${day}, ${month} ${date}`;

    Item.find({}).then(function(allItems) {
        if(allItems.length == 0){
            Item.insertMany(defaultItems)
            .then(function() {
                console.log("Default items inserted successfully!");
            })
            .catch(function(err) {
                console.log(err);
            });
            res.redirect("/");
        }
        else {
            res.render("index", {listTitle: todaysDate, allNotes: allItems});
        }
    })
})

app.post("/", (req, res) => {
    const note = req.body.newNote;
    const listName = req.body.list;

    console.log(note);
    console.log(listName);
    const newItem = new Item({
        name: note
    });

    if(listName === 'Today') {
        newItem.save();
        res.redirect("/");
    }
    else {
        List.findOne({name: listName})
        .then(function(foundList) {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
    

})

app.get("/:customListName", (req, res) => {
    const customURL = _.capitalize(req.params.customListName);

    List.findOne({name: customURL})
    .then (function(foundList) {
        if(!foundList) {
            console.log("New custom list created");
            const list = new List({
                name: customURL,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + customURL);
        }
        else {
            res.render("list", {listTitle: foundList.name, allNotes: foundList.items} )
        }
    })
    .catch(function(err) {
        console.log(err);
    })
})

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.list;

    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId)
        .then(function() {
            res.redirect("/");
        })
        .catch(function(err) {
            console.log(err);
        });
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
        .then(function(foundList) {
            res.redirect("/" + listName);
        })
        .catch(function(err) {
            console.log(err);
        })
    }
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];