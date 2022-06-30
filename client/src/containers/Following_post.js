import React, { useEffect, useState } from "react";
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
  Input,
  Button,
  Form,
  CardSubtitle,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { Link } from "react-router-dom";

// import Heart from "react-animated-heart";
import Comments from "../components/Comments";

const Following_post = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    getPosts();
  }, [posts]);

  const getPosts = async () => {
    await fetch("/post/getFollowedPost", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((err) => console.log(err));
  };

  const likeDislike = async (postId, heart) => {
    await fetch(`/post/${!heart ? "like" : "dislike"}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("socio_token"),
      },
      body: JSON.stringify({ postId: postId }),
    })
      .then((res) => res.json())
      .then((data) => console.log("liked/disliked"));
  };

  const addComment = async (text, postId) => {
    if (text.length > 0) {
      await fetch("/post/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("socio_token"),
        },
        body: JSON.stringify({
          text,
          postId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Commented");
        })
        .catch((err) => console.log(err));
    }
  };

  const deletePost = async (postId) => {
    await fetch(`/post/${postId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toggleDropdown();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container my-5">
      {posts &&
        posts.map((post) => (
          <div key={post._id}>
            <div className="col-md-10 col-12 my-4">
              <Card color="dark" className="p-3">
                <CardTitle
                  tag="h4"
                  color="black"
                  className="mb-4 fw-bolder d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex justify-content-start align-items-center">
                    <img
                      src={
                        post.posted_by.profile
                          ? post.posted_by.profile
                          : "https://images.unsplash.com/photo-1485423036251-8b2a2909899f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBvcnRyYWl0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                      }
                      alt=""
                      className="me-2 border border-white"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />

                    <Link
                      className="text-decoration-none text-white"
                      to={`/profile/${post.posted_by._id}`}
                    >
                      {post.posted_by.name}
                    </Link>
                  </div>

                  {post.posted_by._id === user._id && (
                    <Dropdown
                      style={{ cursor: "pointer" }}
                      direction="left"
                      isOpen={dropdownOpen}
                      toggle={toggleDropdown}
                    >
                      <DropdownToggle
                        tag="span"
                        data-toggle="dropdown"
                        aria-expanded={dropdownOpen}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </DropdownToggle>
                      <DropdownMenu className="bg-dark text-white border fw-bolder px-2 mt-5">
                        <div onClick={() => deletePost(post._id)}>Delete</div>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </CardTitle>
                {post.photo ? (
                  <div className="d-flex justify-content-center">
                    <img
                      src={post.photo}
                      style={{ maxWidth: "100%", maxHeight: "500px" }}
                      alt="Image"
                      onDoubleClick={() =>
                        likeDislike(post._id, post.likes.includes(user._id))
                      }
                    />
                  </div>
                ) : null}
                <CardBody>
                  <CardTitle tag="h5">{post.title}</CardTitle>
                  <CardText className="fs-6" style={{ color: "gray" }}>
                    {post.body}
                  </CardText>

                  <div className="d-flex justify-content-between align-items-center">
                    {/* <Heart
                      isClick={post.likes.includes(user._id)}
                      onClick={() =>
                        likeDislike(post._id, post.likes.includes(user._id))
                      }
                    /> */}
                    {post.likes.includes(user.id) ? (
                    <i
                      className="fas fa-2x my-1 fa-heart"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => likeDislike(post._id, "dislike")}
                    ></i>
                  ) : (
                    <i
                      className="far fa-2x my-1 fa-heart"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => likeDislike(post._id, "like")}
                    ></i>
                  )}

                    <CardText className="fs-6 mt-2" style={{ color: "gray" }}>
                      {post.likes.length} likes · {post.comments.length}{" "}
                      comments
                    </CardText>
                  </div>

                  {/* Add Comment */}
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addComment(e.target[0].value, post._id);
                      e.target[0].value = "";
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-end">
                      <Input
                        type="text"
                        style={inputStyle}
                        name="comment"
                        id="comment"
                        placeholder="Add comment"
                      />
                      <Button color="primary">Post</Button>
                    </div>
                  </Form>

                  {/* Comment */}
                  <CardSubtitle
                    className="text-muted mt-4 fs-6"
                    style={{ cursor: "pointer" }}
                  >
                    <Comments comments={post.comments} postId={post._id} />
                  </CardSubtitle>
                </CardBody>
              </Card>
            </div>
            <hr width="83.5%" />
          </div>
        ))}
    </div>
  );
};

export default Following_post;

const inputStyle = {
  border: "none",
  marginTop: "30px",
  marginRight: "10px",
  borderRadius: "1px",
  borderBottom: "1px solid gray",
  background: "transparent",
  color: "white",
};
