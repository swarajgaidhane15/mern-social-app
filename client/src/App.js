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
import UserProfile from "./containers/UserProfile";
import Following_post from "./containers/Following_post";

import rootReducer from "./reducers";

const initialState = {
  user: null,
  posts: [],
};

export const AppContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(AppContext);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      dispatch({ type: "USER", payload: user });
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
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </AppContext.Provider>
  );
};

export default App;
