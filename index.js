const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const config = require("./config");
const UserRoutes = require("./routes/User");

const app = express();

app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

app.use("/api", UserRoutes);

app.use((req, res, next) => {
  const error = new Error("Route Not Found, Check Your Requested URL");
  error.status = 404;
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(config.port, () => {
  console.log("Server is Running on PORT:", config.port);
});
