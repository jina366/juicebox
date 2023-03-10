require("dotenv").config();

const {PORT = 3000} = process.env;
const express = require("express");
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));

const cors = require("cors")
server.use(cors())

server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<____Body Logger END____>");

  next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);

const { client } = require("./db");
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on the port", PORT);
});
