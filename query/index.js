const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];

    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { postId, id } = data;

    let comments = posts[postId].comments;

    comments = comments.map((item) => {
      if (item.id === id) {
        return { ...data };
      }

      return item;
    });

    posts[postId].comments = comments;
  }
};

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received: ", type);

  handleEvents(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Query service listening on port 4002");

  const events = await axios.get("http://localhost:4005/events");

  for (let event of events.data) {
    console.log("Processing Event: ", event.type);

    handleEvents(event.type, event.data);
  }
});
