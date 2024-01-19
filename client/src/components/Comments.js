import React, { Fragment, useContext, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
} from "reactstrap";

import { AppContext } from "../App";

import { addComment } from "../utils/posts";

const Comments = ({ comments, postId }) => {
  const { dispatch } = useContext(AppContext);

  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState("");

  const isValidComment = comment.trim().length;

  const toggle = () => setModal(!modal);

  const handleAddComment = async () => {
    const { result } = await addComment(comment, postId);
    dispatch({
      type: "UPDATE",
      payload: { comments: result.comments, id: postId },
    });
    setComment("");
  };

  return (
    <Fragment>
      <Button color="info" outline className="fs-6" onClick={toggle}>
        View comments
      </Button>
      <Modal
        className="py-3"
        style={{ color: "black" }}
        isOpen={modal}
        toggle={toggle}
      >
        <ModalHeader>
          <Button color="danger" size="sm" onClick={toggle}>
            Close
          </Button>
        </ModalHeader>
        <ModalBody style={{ maxHeight: "60vh", overflow: "scroll" }}>
          {comments.map((comment, idx) => (
            <div key={idx} className="container d-flex align-items-start mb-2">
              <p className="col-md-3 col-xs-12 fw-bolder fs-6 me-3">
                {comment.posted_by ? comment.posted_by.name : null}
              </p>
              <p className="col-md-9 col-xs-12 fs-6 mb-2">
                {comment.posted_by ? comment.text : null}
              </p>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "100%" }}
          >
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
              disabled={!isValidComment}
              color="primary"
              onClick={handleAddComment}
            >
              Post
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default Comments;

const inputStyle = {
  border: "none",
  marginRight: "10px",
  borderRadius: "1px",
  borderBottom: "1px solid gray",
  background: "transparent",
  color: "black",
};
