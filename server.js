const express = require("express");
const { connection } = require("./configs/db");
const { urlRouter } = require("./routes/url");

require("dotenv").config();
const app = express();
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Home page")
})

app.use("/url",urlRouter)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${process.env.PORT}`);
});
