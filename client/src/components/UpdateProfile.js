import React, { useState, useRef, useContext } from "react";
import { useHistory } from "react-router";
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
import { UserContext } from "../App";

const UpdateProfile = ({ sentData, changeUser, changeProfile }) => {
  const fileRef = useRef(null);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  const [visible, setVisible] = useState(false);
  const onDismiss = () => setVisible(false);
  const [error, setError] = useState("");

  var uri = sentData.profile;
  const [fileName, setFileName] = useState("");

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setUser({
      name: sentData.name,
      email: sentData.email,
      bio: sentData.bio,
    });

    setLoading(false);
    setModal(!modal);
  };

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: sentData.name,
    email: sentData.email,
    bio: sentData.bio,
  });

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (file) => {
    if (!file.type.includes("image") || file.type.includes("gif")) {
      setError("Only images are allowed");
      setVisible(true);
      setFileName("");
      setTimeout(() => setVisible(false), 5000);
      return;
    } else {
      setTimeout(() => uploadImage(file), 1500);
      setFileName(file.name);
    }
  };

  const uploadImage = async (file) => {
    if (file) {
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
          uri = data.url;

          makeRequest();
        })
        .catch((err) => console.log(err));
    }
  };

  const makeRequest = async () => {
    await fetch("/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("socio_token"),
      },
      body: JSON.stringify({
        name: user.name ? user.name : sentData.name,
        email: user.email ? user.email : sentData.email,
        bio: user.bio ? user.bio : sentData.bio,
        url: uri ? uri : sentData.profile,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.msg);
          setLoading(false);
        } else {
          localStorage.setItem("user", JSON.stringify(data.result));
          dispatch({ type: "UPDATE_PROFILE", payload: data.result });
          setLoading(false);
          toggle();

          changeUser(JSON.parse(localStorage.getItem("user")));
          changeProfile(JSON.parse(localStorage.getItem("user")).profile);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteUser = async () => {
    await fetch("/auth/delete", {
      method: "DELETE",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.removeItem("user");
        localStorage.removeItem("socio_token");
        dispatch({ type: "CLEAR" });
        history.push("/auth");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Button
        className="mx-3"
        style={{ backgroundColor: "transparent", border: "none" }}
        onClick={toggle}
      >
        <i className="fas fa-pencil-alt" onClick={toggle}></i>
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
              <Label htmlFor="name">Name</Label>
              <Input
                className="my-2 "
                type="text"
                name="name"
                id="name"
                value={user.name}
                onChange={onChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                className="my-2 "
                type="text"
                name="email"
                id="email"
                value={user.email}
                onChange={onChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                className="my-2 form-control"
                rows="3"
                value={user.bio}
                onChange={onChange}
              ></textarea>
            </FormGroup>

            <FormGroup>
              <input
                ref={fileRef}
                onChange={(e) => handleFileUpload(e.target.files[0])}
                type="file"
                style={{ display: "none" }}
                multiple={false}
              />
              <div className="d-flex align-items-end">
                <Button
                  onClick={(e) => fileRef.current && fileRef.current.click()}
                  className="mt-4 bg-white text-dark fw-bolder"
                  disabled={loading}
                >
                  Update Picture
                </Button>
                <p className="text-muted ms-3">
                  {fileName.length > 25
                    ? fileName.slice(0, 25) + "..."
                    : fileName}
                </p>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          {/* <Button color="danger" className="float-left" onClick={deleteUser}>
            Delete
          </Button> */}

          <Button color="primary" className="me-3" onClick={makeRequest}>
            {!loading ? "Update" : "..."}
          </Button>

          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UpdateProfile;
