import postsReducer from "./postsReducer";
import userReducer from "./userReducer";

const rootReducer = ({ user, posts }, action) => {
  return {
    user: userReducer(user, action),
    posts: postsReducer(posts, action),
  };
};

export default rootReducer;
