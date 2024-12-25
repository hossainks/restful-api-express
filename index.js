// Description: This file is the entry point of the application.
const express = require("express");
const app = express();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  // res.send(courses[req.params.id - 1]);
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res
      .status(404)
      .send(JSON.stringify("The course with the given ID was not found"));
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
