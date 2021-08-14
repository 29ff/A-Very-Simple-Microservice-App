import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    const status = comment.status;
    let content = comment.content;

    if (status === "rejected") content = "This comment was rejected";
    if (status === "pending") content = "This comment is waiting for moderate";

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
