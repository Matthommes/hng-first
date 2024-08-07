const express = require("express");
require("dotenv").config();
const helloRoutes = require("./routes/hello.js");
const app = express();
const port = process.env.PORT || 4000;

app.set("trust proxy", true);

app.use("/api", helloRoutes);
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


module.exports = app