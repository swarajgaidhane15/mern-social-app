import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Fade,
  Card,
  CardText,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";
import { AppContext } from "../App";

const Auth = () => {
  const { dispatch } = useContext(AppContext);
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [response, setResponse] = useState({ error: false, msg: "" });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  var uri = "";

  const [visible, setVisible] = useState(false);
  const onDismiss = () => setVisible(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const postDetails = async () => {
    setLoading(true);

    if (!file) {
      makeRequest();
      return;
    }

    if (!file.type.includes("image") || file.type.includes("gif")) {
      setResponse({ error: true, msg: "Only image type are allowed" });
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
    await fetch(`/auth/${isLogin ? "login" : "signup"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
        profile: uri ? uri : null,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse(data);
        setVisible(true);

        if (!data.error) {
          localStorage.setItem("socio_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          dispatch({ type: "USER", payload: data.user });

          history.push("/");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container ">
      <Card
        color="dark"
        className="container col-md-6 mt-5 text-white"
        style={borderStyle}
      >
        <CardBody>
          <CardTitle
            tag="h5"
            className="text-center socio"
            style={{
              margin: 0,
              padding: 0,
              fontSize: "40px",
              fontFamily: "Grand Hotel', cursive",
            }}
          >
            Socio
          </CardTitle>

          <Alert
            color={response.error ? "danger" : "success"}
            isOpen={visible}
            toggle={onDismiss}
          >
            {response.msg}
          </Alert>

          <Form>
            {!isLogin ? (
              <Fade in={!isLogin}>
                <FormGroup className="my-4">
                  <Label htmlFor="name" className="mb-2">
                    Name
                  </Label>
                  <Input
                    style={inputStyle}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter name"
                    value={user.name}
                    onChange={onChange}
                  />
                </FormGroup>
              </Fade>
            ) : null}

            <FormGroup className="my-4">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                style={inputStyle}
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                value={user.email}
                onChange={onChange}
              />
            </FormGroup>

            <FormGroup className="my-4">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                style={inputStyle}
                name="password"
                id="password"
                placeholder="Enter password"
                value={user.password}
                onChange={onChange}
              />
              <Label
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted float-end pointer mt-1"
                style={{ fontSize: "12px" }}
              >
                {!showPassword ? "Show Password" : "Hide Password"}
              </Label>
            </FormGroup>

            {!isLogin ? (
              <Fade in={!isLogin}>
                <FormGroup className="my-4">
                  <Label htmlFor="name" className="mb-2">
                    Choose Profile Picture
                  </Label>
                  <input
                    type="file"
                    className="my-3 form-control bg-dark text-white"
                    name="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </FormGroup>
              </Fade>
            ) : null}

            <Button disabled={loading} color="primary" onClick={postDetails}>
              {isLogin ? "Login" : "Register"}
            </Button>
          </Form>

          <CardText
            className="my-3 d-flex flex-wrap"
            style={{ fontSize: "16px" }}
          >
            {isLogin ? (
              <>
                Don't have an account ?
                <span
                  className="text-primary mx-1 pointer"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  Register
                </span>
              </>
            ) : (
              <>
                Already have an account ?
                <span
                  className="text-primary mx-1 pointer"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  Login
                </span>
                here
              </>
            )}
          </CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default Auth;

const inputStyle = {
  border: "none",
  borderRadius: "1px",
  borderBottom: "1px solid gray",
  background: "transparent",
  color: "white",
};

const borderStyle = {
  borderColor: "white",
};
