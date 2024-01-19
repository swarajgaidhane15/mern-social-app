import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardTitle,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { AppContext } from "../App";
import CustomCardBody from "../components/Card/CardBody";

import { likeDislike } from "../utils/posts";

const Following_post = () => {
  const [posts, setPosts] = useState([]);
  const {
    state: { user },
  } = useContext(AppContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    getPosts();

    return () => {
      setPosts([]);
      setDropdownOpen(false);
    };
  }, []);

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

  const deletePost = async (postId) => {
    toggleDropdown();
    await fetch(`/post/${postId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
      },
    }).catch((err) => console.log(err));
  };

  return (
    <div className="container my-5">
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card col-md-10 col-12 my-4">
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
                    className="pointer"
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
                    alt="Failed to load post"
                    onDoubleClick={() =>
                      likeDislike(
                        post._id,
                        post.likes.includes(user._id) ? "dislike" : "like"
                      )
                    }
                  />
                </div>
              ) : null}
              <CustomCardBody post={post} />
            </Card>
          </div>
        ))}
    </div>
  );
};

export default Following_post;
