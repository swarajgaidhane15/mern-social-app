import React, {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useReducer,
} from "react";
import "./App.css";

import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./containers/Home";
import Auth from "./containers/Auth";
import Profile from "./containers/Profile";
import UserProfile from "./containers/UserProfile";
import FollowingPost from "./containers/FollowingPost";

import rootReducer from "./reducers";

const initialState = {
  user: null,
  posts: [],
  following: [],
};

export const AppContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const localUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (localUser) {
      dispatch({ type: "LOGIN", payload: localUser });
    } else {
      navigate("/auth");
    }
  }, []);

  return (
    <Routes>
      {localUser ? (
        <Fragment>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/following/posts" element={<FollowingPost />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Fragment>
      ) : (
        <Route path="/auth" element={<Auth />} />
      )}
    </Routes>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
