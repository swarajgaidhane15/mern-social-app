import React, { useEffect, useState } from "react";

import UpdateProfile from "../components/UpdateProfile";
import UserPosts from "../components/UserPosts";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("user")).profile
  );
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getMyPosts();
  }, []);

  const getMyPosts = async () => {
    await fetch("/post/myposts", {
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

  return (
    <div className="container mt-5">
      <div className="row pb-4">
        <div className="col-md-4 col-12 d-flex flex-column justify-content-center mb-4 align-items-center">
          <img
            src={
              profile
                ? profile
                : "https://images.unsplash.com/photo-1485423036251-8b2a2909899f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBvcnRyYWl0fGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            }
            alt="Profile"
            style={{ width: "240px", height: "240px", borderRadius: "50%" }}
          />
        </div>
        <div className="col-md-6 col-12 p-4">
          <p className="fw-bolder fs-2 d-flex">
            {user.name}
            <UpdateProfile
              sentData={user}
              changeUser={setUser}
              changeProfile={setProfile}
            />
          </p>
          <p className="fs-5 pb-2">{user.bio}</p>
          <div className="d-flex justify-content-between">
            <p className="fw-bold fs-5">{posts && posts.length} posts</p>
            <p className="fw-bold fs-5">{user.followers.length} followers</p>
            <p className="fw-bold fs-5">{user.following.length} following</p>
          </div>
        </div>
      </div>
      <UserPosts posts={posts} />
    </div>
  );
};

export default Profile;
