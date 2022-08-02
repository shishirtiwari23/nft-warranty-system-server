const express = require("express");
const cors = require("cors");
const config = require("./config");
const { User, ParentClient, ChildClient } = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());
// app.use(cors({ exposedHeaders: "Authorization" }));

app.use("/api", User);
app.use("/api", ParentClient);
app.use("/api", ChildClient);

app.use((req, res, next) => {
  const error = new Error(
    "Route Not Found, Check Your Requested URL and Request Type"
  );
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
