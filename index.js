// Description: This file is the entry point of the application.
const Joi = require("joi");
const morgan = require("morgan");
const express = require("express");
const logger = require("./logger.js");
const app = express();
/* console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get("env")}`); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(logger);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

app.use(function (req, res, next) {
  console.log("Authentication...");
  next();
});

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

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
  /*  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const { error, value } = schema.validate({ name: req.body.name }); */
  // console.log(error);

  /* if (!req.body.name || req.body.name.length < 3) {
    res
      .status(400)
      .send(
        JSON.stringify("Name is required and should be minimum 3 characters")
      );
    return;
  } */
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res
      .status(404)
      .send(JSON.stringify("The course with the given ID was not found"));
    return;
  }
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  // res.send(courses[req.params.id - 1]);
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send(JSON.stringify("The course with the given ID was not found"));
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send(JSON.stringify("The course with the given ID was not found"));
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate({ name: course.name });
}
