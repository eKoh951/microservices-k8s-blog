const express = require("express");
const bodyParser = require("body-parser"); // Used to parse the JSON body from the requests
const { randomBytes } = require("crypto"); // Package to generate random id
const cors = require("cors");
const axios = require("axios");

const app = express();

const posts = {};

// Middlewares
app.use(bodyParser.json());
app.use(cors()); // Using CORS package to be able to handle requests from other domains/ports

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("v21");
  console.log("Listening on 4000");
});
