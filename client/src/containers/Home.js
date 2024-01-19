import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle, Spinner } from "reactstrap";

import { AppContext } from "../App";
import CustomCardBody from "../components/Card/CardBody";

import { likeDislike } from "../utils/posts";

const Home = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const {
    state: { posts, user },
    dispatch,
  } = useContext(AppContext);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setIsPageLoading(true);
    await fetch("/post", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
      },
    })
      .then((res) => res.json())
      .then(({ posts }) => {
        dispatch({ type: "FETCH_ALL", payload: posts });
        setIsPageLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = async (postId) => {
    await fetch(`/post/${postId}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
      },
    })
      .then((res) => res.json())
      .then(() => {
        dispatch({ type: "DELETE", payload: postId });
      })
      .catch((err) => console.log(err));
  };

  const localLikeDislike = async (postId, action) => {
    const { result } = await likeDislike(postId, action);
    dispatch({ type: "UPDATE", payload: { likes: result.likes, id: postId } });
  };

  if (isPageLoading) {
    return (
      <div className="container text-center my-5">
        <Spinner color="light">Loading...</Spinner>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="col-md-10 col-12 my-4">
            <Card color="dark" className="card p-3">
              <CardTitle
                tag="h4"
                color="black"
                className="mb-4 fw-bold d-flex justify-content-between align-items-center"
              >
                <div className="d-flex justify-content-start align-items-center">
                  <img
                    src={
                      post.posted_by.profile
                        ? post.posted_by.profile
                        : "https://images.unsplash.com/photo-1485423036251-8b2a2909899f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBvcnRyYWl0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                    }
                    alt="Profile"
                    className="me-2 border border-white"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />

                  <Link
                    className="text-decoration-none text-white"
                    to={`/profile/${
                      post.posted_by._id !== user._id ? post.posted_by._id : ""
                    }`}
                  >
                    {post.posted_by.name}
                  </Link>
                </div>

                {post.posted_by._id === user._id && (
                  <img
                    className="pointer"
                    width={20}
                    src="/bin.svg"
                    alt="Delete"
                    onClick={() => deletePost(post._id)}
                  />
                )}
              </CardTitle>
              {post.photo ? (
                <div className="d-flex justify-content-center">
                  <img
                    src={post.photo}
                    style={{ maxWidth: "100%", maxHeight: "500px" }}
                    alt="Failed to load post"
                    onDoubleClick={() =>
                      localLikeDislike(
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

export default Home;
