import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "reactstrap";

import { AppContext } from "../App";
import CustomCardBody from "../components/Card/CardBody";

import { likeDislike } from "../utils/posts";

const FollowingPost = () => {
  const {
    state: { user, following: posts },
    dispatch,
  } = useContext(AppContext);

  useEffect(() => {
    getPosts();
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
        dispatch({ type: "FETCH_ALL_FOLLOWING", payload: data.posts });
      })
      .catch((err) => console.log(err));
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
                        : "/default.avif"
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
              <CustomCardBody post={post} isFollowingPage />
            </Card>
          </div>
        ))}
    </div>
  );
};

export default FollowingPost;
