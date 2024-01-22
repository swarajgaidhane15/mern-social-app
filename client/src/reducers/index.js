import postsReducer from "./postsReducer";
import userReducer from "./userReducer";
import followingReducer from "./followingReducer";

const rootReducer = ({ user, posts, following }, action) => {
  return {
    user: userReducer(user, action),
    posts: postsReducer(posts, action),
    following: followingReducer(following, action),
  };
};

export default rootReducer;
