const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB = "users.json";

function read() {
  return JSON.parse(fs.readFileSync(DB));
}
function write(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

app.post("/register", (req, res) => {
  const users = read();
  if (users.find(u => u.email === req.body.email))
    return res.status(400).json({ error: "exists" });

  users.push(req.body);
  write(users);
  res.json({ ok: true });
});

app.post("/login", (req, res) => {
  const users = read();
  const u = users.find(
    x => x.email === req.body.email && x.password === req.body.password
  );
  if (!u) return res.status(401).json({ error: "bad" });
  res.json({ ok: true, username: u.username });
});

app.listen(3001, () => console.log("API on 3001"));
