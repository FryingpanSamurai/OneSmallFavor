const express = require("express");
const app = express();
const pool = require("./database");
const bodyParser = require("body-parser");
const uuid = require('uuid');

app.use(bodyParser.json());

// Define API endpoints
// decks
app.get("/decks", async (req, res) => {
  const decks = await pool.query("SELECT * FROM deck");
  res.json(decks);
});

app.post("/decks", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const raw_id = await pool.query("SELECT nextval('deck_id_seq')");
  let id = raw_id.rows[0].nextval;

  await pool.query("INSERT INTO deck (id, name, description) VALUES ($1, $2, $3)", [id, name, description]);
  res.json({ message: "Success", id: id });
});

app.put("/decks/:id", async (req,res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  await pool.query("UPDATE deck SET name=$1, description=$2, updated_at=$4 WHERE id=$3", [name, description, id, updated_at]);
  res.json({ message: "Success" });
});

app.delete("/decks/:id", async (req,res) => {
  const id = req.params.id;
  await pool.query("DELETE FROM deck WHERE id=$1", [id]);
  res.json({ message: "Success" });
})


// planks
app.get("/planks", async (req, res) => {
  const planks = await pool.query("SELECT * FROM plank");
  res.json(planks);
});

app.post("/planks", async (req, res) => {
  const deck_id = req.body.deck_id;
  const name = req.body.name;
  const description = req.body.description;
  const raw_id = await pool.query("SELECT nextval('plank_id_seq')");
  const id = raw_id.rows[0].nextval;
  await pool.query("INSERT INTO plank (id, name, description, deck_id) VALUES ($1, $2, $3, $4)", [id, name, description, deck_id]);
  res.json({ message: "Success", id:id });
});

app.put("/planks/:id", async (req,res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const status = req.body.status;
  const updated_at = req.body.updated_at;
  await pool.query("UPDATE plank SET name=$1, description=$2, status=$3, updated_at=$4 WHERE id=$5", [name, description, status, updated_at, id]);
  res.json({ message: "Success" });
});

app.delete("/planks/:id", async (req,res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  await pool.query("DELETE FROM plank WHERE id=$1", [id]);
  res.json({ message: "Success" });
})

// nails
app.get("/nails", async (req, res) => {
  const planks = await pool.query("SELECT * FROM nail");
  res.json(planks);
});


app.post("/nails", async (req, res) => {
  const plank_id = req.body.plank_id;
  const name = req.body.name;
  const description = req.body.description;
  const raw_id = await pool.query("SELECT nextval('nail_id_seq')");
  const id = raw_id.rows[0].nextval;
  await pool.query("INSERT INTO nail (id, name, description, plank_id) VALUES ($1, $2, $3, $4)", [id, name, description, plank_id]);
  res.json({ message: "Success" });
});

app.put("/nails/:id", async (req,res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  await pool.query("UPDATE nail SET name=$1, description=$2, status=$3 WHERE id=$4", [name, description, status, id]);
  res.json({ message: "Success" });
});

app.delete("/nails/:id", async (req,res) => {
  const id = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  await pool.query("DELETE FROM nail WHERE id=$1", [id]);
  res.json({ message: "Success" });
})


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});