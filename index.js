// Description: This file is the entry point of the application.
const startUpDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const morgan = require("morgan");
const logger = require("./middleware/logger.js");
const courses = require("./routes/courses.js");
const homepage = require("./routes/homepage.js");
const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); // default
/* console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get("env")}`); */

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
//console.log("Mail Password: " + config.get("mail.password"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(logger);
app.use("/api/courses", courses);
app.use("/", homepage);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startUpDebugger("Morgan enabled...");
}

dbDebugger("Connected to the database...");

app.use(function (req, res, next) {
  console.log("Authentication...");
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
