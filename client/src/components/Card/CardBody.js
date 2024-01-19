import React, { useContext, useState } from "react";
import {
  CardText,
  CardBody,
  CardTitle,
  Input,
  Button,
  Form,
  CardSubtitle,
} from "reactstrap";

import Comments from "../Comments";

import { addComment, likeDislike } from "../../utils/posts";
import { AppContext } from "../../App";

const Body = ({ post }) => {
  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);
  const [comment, setComment] = useState("");

  const isValidComment = comment.trim().length;

  const handleSubmit = async (e) => {
    if (!isValidComment) return;

    e.preventDefault();
    const { result } = await addComment(comment, post._id);
    dispatch({
      type: "UPDATE",
      payload: { comments: result.comments, id: post._id },
    });
    setComment("");
  };

  const localLikeDislike = async (action) => {
    const { result } = await likeDislike(post._id, action);
    dispatch({
      type: "UPDATE",
      payload: { likes: result.likes, id: post._id },
    });
  };

  return (
    <CardBody>
      <CardTitle tag="h5" className="text-white">
        {post.title}
      </CardTitle>
      <CardText className="fs-6" style={{ color: "gray" }}>
        {post.body}
      </CardText>

      <div className="d-flex justify-content-between align-items-center">
        {post.likes.includes(user._id) ? (
          <img
            src="/heart-fill.svg"
            alt="Liked"
            width={30}
            onClick={() => localLikeDislike("dislike")}
          />
        ) : (
          <img
            src="/heart-outline.svg"
            alt="Liked"
            width={30}
            onClick={() => localLikeDislike("like")}
          />
        )}

        <CardText className="fs-6 mt-2" style={{ color: "gray" }}>
          {post.likes.length} likes · {post.comments.length} comments
        </CardText>
      </div>

      {/* Add Comment */}
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-end">
          <Input
            type="text"
            style={inputStyle}
            name="comment"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comment"
          />
          <Button
            color={isValidComment ? "success" : "secondary"}
            outline={!isValidComment}
            disabled={!isValidComment}
          >
            Post
          </Button>
        </div>
      </Form>

      {/* Comment */}
      {post.comments.length > 0 && (
        <CardSubtitle className="mt-4 fs-6 pointer">
          <Comments comments={post.comments} postId={post._id} />
        </CardSubtitle>
      )}
    </CardBody>
  );
};

export default Body;

const inputStyle = {
  border: "none",
  marginTop: "30px",
  marginRight: "10px",
  borderRadius: "1px",
  borderBottom: "1px solid gray",
  background: "transparent",
  color: "white",
};
