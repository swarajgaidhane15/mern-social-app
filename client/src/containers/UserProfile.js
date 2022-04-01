import React, { useContext, useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useParams } from "react-router-dom";

import { UserContext } from "../App";

const UserProfile = () => {
  const { id } = useParams();
  const { state, dispatch } = useContext(UserContext);

  const [filter, setFilter] = useState(0);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFollow, setShowFollow] = useState(
    JSON.parse(localStorage.getItem("user")).following.includes(id)
  );

  useEffect(() => {
    getUserDetails();
  }, [posts, state]);

  const getUserDetails = async () => {
    await fetch(`/user/${id}`, {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("socio_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setUser(data.user);
      })
      .catch((err) => console.log(err));
  };

  const followUnfollow = async (following, count) => {
    setLoading(true);
    await fetch(`/user/${following ? "unfollow" : "follow"}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("socio_token"),
      },
      body: JSON.stringify({ followId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.result.following,
            followers: data.result.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data.result));
        setShowFollow(
          JSON.parse(localStorage.getItem("user")).following.includes(id)
        );

        if (count < 1 && following) {
          followUnfollow(following, count + 1);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
      <div className="row pb-4">
        <div className="col-md-4 col-12 d-flex justify-content-center mb-4 align-items-center">
          <img
            src={
              user.profile
                ? user.profile
                : "https://images.unsplash.com/photo-1485423036251-8b2a2909899f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBvcnRyYWl0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            }
            alt="Profile"
            style={{ width: "240px", height: "240px", borderRadius: "50%" }}
          />
        </div>
        <div className="col-md-6 col-12 p-4">
          <div className="d-flex justify-content-between align-items-center">
            <p className="fw-bolder fs-1">{user.name}</p>
            {state && id !== state._id && (
              <Button
                disabled={loading}
                color="success"
                onClick={() => followUnfollow(showFollow, 0)}
              >
                {showFollow ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          <p className="fw-bolder text-muted pb-2">{user.email}</p>
          <div className="d-flex justify-content-between">
            <p className="fw-bold fs-5 me-2">{posts.length} posts</p>
            <p className="fw-bold fs-5 me-2">
              {user.followers && user.followers.length} followers
            </p>
            <p className="fw-bold fs-5 ">
              {user.following && user.following.length} following
            </p>
          </div>
        </div>
      </div>

      <div className="container mt-4 d-flex border-bottom border-white fw-bolder fs-3">
        <div
          onClick={() => setFilter(0)}
          className="container mb-3 text-center border-end border-white"
          style={{ cursor: "pointer", color: filter ? "gray" : "white" }}
        >
          Images
        </div>

        <div
          onClick={() => setFilter(1)}
          className="container mb-3 text-center"
          style={{ cursor: "pointer", color: !filter ? "gray" : "white" }}
        >
          Tweets
        </div>
      </div>

      {/* Posts gallery */}
      <div className="posts d-flex flex-wrap justify-content-start my-4">
        {!filter &&
          posts
            .filter((post) => post.photo !== "")
            .map((post) => (
              <div key={post._id} title={post.title} className="m-4">
                <img
                  src={post.photo}
                  alt={post.title}
                  style={{ width: "300px", height: "300px" }}
                />
              </div>
            ))}
      </div>

      {filter &&
        posts
          .filter((post) => post.photo === "")
          .map((post) => (
            <div key={post._id}>
              <div className="col-md-10 col-12 my-4">
                <Card color="dark" className="p-3 border">
                  <CardBody>
                    <CardTitle tag="h5">{post.title}</CardTitle>
                    <CardText className="fs-6">{post.body}</CardText>
                  </CardBody>
                </Card>
              </div>
              <hr width="83.5%" />
            </div>
          ))}
    </div>
  );
};

export default UserProfile;
