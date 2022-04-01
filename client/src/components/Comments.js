import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
} from "reactstrap";

const Comments = ({ comments, postId }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [comment, setComment] = useState("");

  const addComment = async () => {
    await fetch("/post/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("socio_token"),
      },
      body: JSON.stringify({
        text: comment,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Commented");
        setComment("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Button
        style={{ backgroundColor: "transparent", border: "none" }}
        onClick={toggle}
      >
        <div className="text-muted fs-6" style={{ cursor: "pointer" }}>
          View comments
        </div>
      </Button>
      <Modal
        className="py-3"
        style={{ color: "black" }}
        isOpen={modal}
        toggle={toggle}
      >
        <ModalHeader>
          <Button color="danger" onClick={toggle}>
            Close
          </Button>
        </ModalHeader>
        <ModalBody style={{ maxHeight: "60vh", overflow: "scroll" }}>
          {comments.map((comment) => (
            <div className="container d-flex align-items-start mb-2">
              <div className="col-md-3 col-xs-12 fw-bolder fs-6 me-3">
                {comment.posted_by ? comment.posted_by.name : null}
              </div>
              <div className="col-md-9 col-xs-12 fs-6 mb-2">
                {comment.posted_by ? comment.text : null}
              </div>
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
            <Button disabled={!comment} color="primary" onClick={addComment}>
              Post
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
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
