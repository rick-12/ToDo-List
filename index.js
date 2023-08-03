import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function main() {
  try {

    await mongoose.connect("mongodb://localhost:27017/todolistDB");
    console.log("Successfully connected to the database");

  } catch (error) {
    console.log(error.message);
  }

  const itemsSchema = new mongoose.Schema({
    name: String
  });

  const Item = mongoose.model("Item", itemsSchema);

  const item1 = new Item({
    name: "Discuss on the project"
  });

  const item2 = new Item({
    name: "Wash clothes"
  });

  const item3 = new Item({
    name: "Watch Cricket"
  });

  const defaultItems = [item1, item2, item3];

  app.get("/", async (req, res) => {
    try {
      const n = await Item.countDocuments();
      if (n === 0) {
        try {
          await Item.insertMany(defaultItems);
        } catch (error) {
          console.log(error.message);
        }
      }
      const itemsArray = await Item.find({}).sort({_id: 1});
      res.render("index.ejs", {
        title: "Today",
        listItems: itemsArray,
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  app.get("/types/:type", (req, res) => {
    const type = req.params.type;
    res.redirect(`/${type}`);
  });

  app.post("/", async (req, res) => {
    const newItem = req.body.newItem;
    const item = new Item({
      name: newItem
    });
    await item.save();
    res.redirect("/");
  });

  app.post("/newItem", (req, res) => {
    const newItem = req.body.newItem;
    types.push(newItem);
    res.redirect("/");
  })

  app.post("/edit", async(req, res) => {
    try {
      await Item.updateOne({ _id: req.body.id}, {
        $set: {
          name: req.body.modifiedItem
        }
      });
      console.log("Successfully edited the item, id:", req.body.id);
    } catch (error) {
      console.log(error.message);
    }
    res.redirect("/");
  })

  app.post("/delete", async(req, res) => {
    try {
      await Item.findByIdAndDelete(req.body.id);
      console.log("Successfully deleted the item");
    } catch (error) {
      console.log(error.message);
    }
    res.redirect("/");
  })

  app.listen(PORT, () => {
    console.log(`Server started listening at http://localhost:${PORT}`);
  })
}

main();