const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:postId/comments", (req, res) => {
  res.send(commentsByPostId[req.params.postId] || []);
});

app.post("/posts/:postId/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.postId] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.postId] = comments;

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Comment app listening on port 4001");
});
