const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:postId/comments", (req, res) => {
  res.send(commentsByPostId[req.params.postId] || []);
});

app.post("/posts/:postId/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.postId] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.postId] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.postId,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Event Received: ", type);

  if (type === "CommentModerated") {
    let comments = commentsByPostId[data.postId];

    comments = comments.map((item) => {
      if (item.id === data.id) {
        return { ...data };
      }
      return item;
    });

    commentsByPostId[data.postId] = comments;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        ...data,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Comment app listening on port 4001");
});
