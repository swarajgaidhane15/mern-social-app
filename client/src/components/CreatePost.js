import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

const CreatePost = () => {
  const [visible, setVisible] = useState(false);
  const onDismiss = () => setVisible(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setFile(null);
    setPost({
      title: "",
      body: "",
      imageUrl: "",
    });
    setLoading(false);
    setModal(!modal);
  };

  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState({
    title: "",
    body: "",
    imageUrl: "",
  });
  var uri = "";

  const [file, setFile] = useState(null);

  const onChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const postDetails = async () => {
    setLoading(true);

    if (!file) {
      makeRequest();
      return;
    }

    if (!file.type.includes("image")) {
      setError("Only images and GIFs are allowed");
      setVisible(true);
      setLoading(false);
      return;
    }
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "socio1508");
    data.append("cloud_name", "socio1508");

    await fetch("https://api.cloudinary.com/v1_1/socio1508/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        uri = uri + data.url;
        makeRequest();
      })
      .catch((err) => console.log(err));
  };

  const makeRequest = async () => {
    await fetch("/post", {
      method: "POST",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: post.title,
        body: post.body,
        imageUrl: uri,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        toggle();
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Button
        className="mx-3"
        style={{ backgroundColor: "transparent", border: "none" }}
        onClick={toggle}
      >
        <i className="fas fa-2x fa-plus-circle" onClick={toggle}></i>
      </Button>
      <Modal
        className="py-3"
        style={{ color: "black" }}
        isOpen={modal}
        toggle={toggle}
      >
        <ModalBody>
          <Alert color="danger" isOpen={visible} toggle={onDismiss}>
            {error}
          </Alert>

          <Form>
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                className="my-2 "
                type="text"
                name="title"
                id="title"
                placeholder="Add title"
                value={post.title}
                onChange={onChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="body">Body</Label>
              <textarea
                id="body"
                name="body"
                className="my-2 form-control"
                rows="4"
                value={post.body}
                onChange={onChange}
              ></textarea>
            </FormGroup>

            <FormGroup>
              <Input
                type="file"
                className="my-3"
                name="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={!post.title || !post.body || loading}
            onClick={postDetails}
            color="primary"
          >
            {!loading ? "Add" : "..."}
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CreatePost;
