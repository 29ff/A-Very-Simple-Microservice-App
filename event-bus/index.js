const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://posts-clusterip-srv:4000/posts/events", event);
  axios.post("http://comments-clusterip-srv:4001/comments/events", event);
  axios.post("http://query-clusterip-srv:4002/query/events", event);
  axios.post("http://moderation-clusterip-srv:4003/moderation/events", event);

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Event bus is listening on port 4005");
});
