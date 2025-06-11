const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const DATA = "foodDiary.json";
if (!fs.existsSync(DATA)) fs.writeFileSync(DATA, "[]");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/diary", (req, res) => {
  const list = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const entry = { id: Date.now(), ...req.body, timestamp: new Date().toISOString() };
  list.push(entry);
  fs.writeFileSync(DATA, JSON.stringify(list, null, 2));
  res.json({ success: true, id: entry.id });
});

app.get("/api/diary", (req, res) => {
  res.json(JSON.parse(fs.readFileSync(DATA, "utf8")));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
