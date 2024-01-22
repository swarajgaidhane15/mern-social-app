import React, { Fragment, useState } from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

const FILTERS = {
  IMAGES: "images",
  TWEETS: "tweets",
};

const UserPosts = ({ posts }) => {
  const [filter, setFilter] = useState(FILTERS.IMAGES);
  return (
    <Fragment>
      <div className="d-flex justify-content-center my-4 d-flex fw-bolder fs-5">
        <div
          onClick={() => setFilter(FILTERS.IMAGES)}
          className="text-center border px-5 py-2 pointer"
          style={{
            color: filter === FILTERS.IMAGES ? "gray" : "white",
          }}
        >
          Images
        </div>
        <div
          onClick={() => setFilter(FILTERS.TWEETS)}
          className="text-center border px-5 py-2 pointer"
          style={{
            color: filter === FILTERS.TWEETS ? "gray" : "white",
          }}
        >
          Tweets
        </div>
      </div>

      {/* Posts gallery */}
      {filter === FILTERS.IMAGES && (
        <div className="posts d-flex flex-wrap justify-content-start my-4">
          {posts.length
            ? posts
                .filter((post) => post.photo !== "")
                .map((post) => (
                  <div key={post._id} className="m-4">
                    <img
                      src={post.photo}
                      alt={post.title}
                      style={{ width: "300px", height: "300px" }}
                    />
                  </div>
                ))
            : null}
        </div>
      )}

      {/* Tweets */}
      {filter === FILTERS.TWEETS &&
        posts
          .filter((post) => post.photo === "")
          .map((post) => (
            <div key={post._id}>
              <div className="col-md-10 col-12 my-4">
                <Card className="p-3 border">
                  <CardBody>
                    <CardTitle tag="h5">{post.title}</CardTitle>
                    <CardText className="fs-6">{post.body}</CardText>
                  </CardBody>
                </Card>
              </div>
              <hr width="83.5%" />
            </div>
          ))}
    </Fragment>
  );
};

export default UserPosts;
