const express = require("express");
const port = 8000;
const db = require("./config/mongoose");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const myRoute = require("./routes");
app.use("/", myRoute);

app.listen(port, function (error) {
  if (error) {
    console.log("error on running the express server ", error);
    return;
  }

  console.log("express server up and running at port: ", port);
});
