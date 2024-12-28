const Joi = require("joi");
const express = require("express");
const router = express.Router();
router.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.get("/:id", (req, res) => {
  // res.send(courses[req.params.id - 1]);
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send(JSON.stringify("The course with the given ID was not found"));
  res.send(course);
});

router.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send(JSON.stringify("The course with the given ID was not found"));
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate({ name: course.name });
}

module.exports = router;
