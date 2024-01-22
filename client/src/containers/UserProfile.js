import React, { useContext, useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useParams } from "react-router-dom";

import { AppContext } from "../App";

import UserPosts from "../components/UserPosts";

const UserProfile = () => {
  const { id } = useParams();
  const {
    state: { user: loggedInUser },
    dispatch,
  } = useContext(AppContext);

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFollow, setShowFollow] = useState(
    JSON.parse(localStorage.getItem("user")).following.includes(id)
  );

  useEffect(() => {
    getUserDetails();
  }, []);

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

  const followUnfollow = async (isFollowing, count) => {
    setLoading(true);
    await fetch(`/user/${isFollowing ? "unfollow" : "follow"}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("socio_token"),
      },
      body: JSON.stringify({ followId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        getUserDetails();
        setShowFollow(!isFollowing);
        dispatch({
          type: "FOLLOW_USER",
          payload: {
            following: data.result.following,
            followers: data.result.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data.result));

        // if (count < 1 && isFollowing) {
        //   followUnfollow(isFollowing, count + 1);
        // }
        setLoading(false);
      })
      .catch((err) => console.log(err.error));
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
          <div className="d-flex justify-content-between align-items-baseline">
            <p className="fw-bolder fs-2">{user.name}</p>
            {loggedInUser && id !== loggedInUser._id && (
              <Button
                disabled={loading}
                size="sm"
                color="success"
                onClick={() => followUnfollow(showFollow, 0)}
              >
                {showFollow ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          <p className="pb-2">{user.email}</p>
          <div className="d-flex align-items-center justify-content-between">
            <span className="fw-bold fs-5 me-2">{posts.length} posts</span>
            <span className="fw-bold fs-5 me-2">
              {user.followers && user.followers.length} followers
            </span>
            <span className="fw-bold fs-5 ">
              {user.following && user.following.length} following
            </span>
          </div>
        </div>
      </div>

      <UserPosts posts={posts} />
    </div>
  );
};

export default UserProfile;
