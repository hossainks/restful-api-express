const express = require("express");
const app = express();

app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});

app.get("/api/postsQuery/:year/:month", (req, res) => {
  res.send(req.query);
});
