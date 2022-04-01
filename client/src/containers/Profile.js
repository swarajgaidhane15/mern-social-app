import React, { useEffect, useState, useContext } from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import UpdateProfile from "../components/UpdateProfile";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("user")).profile
  );
  const [filter, setFilter] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getMyPosts();
  }, [posts, user]);

  const getMyPosts = () => {
    fetch("/post/myposts", {
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
          <p className="fw-bolder fs-1 d-flex">
            {user.name}
            <UpdateProfile
              sentData={user}
              changeUser={setUser}
              changeProfile={setProfile}
            />
          </p>
          <p className="text-muted fs-5 pb-2">{user.bio}</p>
          <div className="d-flex justify-content-between">
            <p className="fw-bold fs-5">{posts && posts.length} posts</p>
            <p className="fw-bold fs-5">{user.followers.length} followers</p>
            <p className="fw-bold fs-5">{user.following.length} following</p>
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
              <div key={post._id} className="m-4">
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

export default Profile;
