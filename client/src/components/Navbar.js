import React, { Fragment, useState, useContext } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

import CreatePost from "../components/CreatePost";
import { AppContext } from "../App";

const NavbarComponent = () => {
  const navigate = useNavigate();

  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("socio_token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <Navbar className="px-4 navbar" color="dark" dark expand="md">
      <span className="d-flex align-items-center">
        <Link
          className="socio text-decoration-none text-white"
          to={user ? "/" : "/auth"}
          style={{
            margin: 0,
            padding: 0,
            fontSize: "40px",
          }}
        >
          Socio
        </Link>
        {user ? <CreatePost /> : null}
      </span>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav
          className="d-flex align-items-center justify-content-end"
          style={{ width: "100%" }}
          navbar
        >
          {user ? (
            <Fragment>
              <NavItem>
                <Link
                  className="text-decoration-none text-white me-4"
                  to="/profile"
                >
                  {user.name}
                </Link>
              </NavItem>

              <NavItem>
                <Link
                  to="/following/posts"
                  className="text-decoration-none text-white fw-bolder me-4"
                >
                  Following
                </Link>
              </NavItem>

              <NavItem>
                <NavLink
                  onClick={logout}
                  className="text-decoration-none text-danger fw-bolder mr-4 pointer"
                >
                  Logout
                </NavLink>
              </NavItem>
            </Fragment>
          ) : (
            <NavItem>
              <Link className="text-decoration-none text-white" to="/auth">
                Login
              </Link>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
