import React, {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useReducer,
} from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./containers/Home";
import Auth from "./containers/Auth";
import Profile from "./containers/Profile";

import { initialState, reducer } from "./reducers/userReducer";
import UserProfile from "./containers/UserProfile";
import Following_post from "./containers/Following_post";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push("/");
    } else {
      history.push("/auth");
    }
  }, []);

  return (
    <Switch>
      {user ? (
        <Fragment>
          <Route exact path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/profile/:id" component={UserProfile} />
          <Route path="/following/posts" component={Following_post} />

          <Redirect path="**" to="/" />
        </Fragment>
      ) : (
        <Route to="/auth" component={Auth} />
      )}
    </Switch>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
