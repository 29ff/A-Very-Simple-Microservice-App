const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  console.log("Event Received: ", req.body.type);
  if (req.body.type === "PostCreated") {
    const { id, title } = req.body.data;

    posts[id] = { id, title, comments: [] };
  }

  if (req.body.type === "CommentCreated") {
    const { id, content, postId, status } = req.body.data;

    const post = posts[postId];

    post.comments.push({ id, content, status });
  }

  if (req.body.type === "CommentUpdated") {
    const { postId, id } = req.body.data;

    let comments = posts[postId].comments;

    comments = comments.map((item) => {
      if (item.id === id) {
        return { ...req.body.data };
      }

      return item;
    });

    posts[postId].comments = comments;
  }

  console.log(posts);

  res.send({});
});

app.listen(4002, () => {
  console.log("Query service listening on port 4002");
});
