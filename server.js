const path = require('path')
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileupload = require('express-fileupload');
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//include the path
dotenv.config({ path: "./config/config.env" });
//connect to Database
connectDB();

//Routes Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

//Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
//Always make sure that errroHandler comes after Express route
app.use(errorHandler);

const PORT = 5000;

app.listen(
  PORT,
  console.log(`server started ${process.env.NODE_ENV} mode on PORT ${PORT}`)
);
