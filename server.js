require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Router = require("./Router/router");
const connectDB = require("./config/database");
const { notFound, errorHandler } = require("./middleware/auth");
let cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use(express.json()); //utilizes the body-parser package
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.use("/v1/booking/", Router);

app.use(notFound);
app.use(errorHandler);

(async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
