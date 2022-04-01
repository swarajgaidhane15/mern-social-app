import React, { useContext, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";

import CreatePost from "../components/CreatePost";
import { UserContext } from "../App";

const NavbarComponent = (props) => {
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { state, dispatch } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem("socio_token");
    localStorage.removeItem("user");
    dispatch({ type: "CLEAR" });

    history.push("/auth");
  };

  return (
    <Navbar className="px-4 navbar" color="dark" dark expand="md">
      <NavbarBrand
        className="socio"
        style={{
          margin: 0,
          padding: 0,
          fontSize: "40px",
        }}
      >
        <span className="d-flex">
          <Link
            className="text-decoration-none text-white"
            to={state ? "/" : "/auth"}
          >
            Socio
          </Link>
          {state ? <CreatePost /> : null}
        </span>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="justify-content-end" style={{ width: "100%" }} navbar>
          {state ? (
            <>
              <NavItem>
                <NavLink>
                  <Link
                    className="text-decoration-none text-white me-4"
                    to="/profile"
                  >
                    {JSON.parse(localStorage.getItem("user")).name}
                  </Link>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink>
                  <Link
                    to="/following/posts"
                    className="text-decoration-none text-white fw-bolder me-4"
                  >
                    Following
                  </Link>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink>
                  <Link
                    onClick={logout}
                    className="text-decoration-none text-danger fw-bolder mr-4"
                  >
                    Logout
                  </Link>
                </NavLink>
              </NavItem>
            </>
          ) : (
            <NavItem>
              <NavLink>
                <Link className="text-decoration-none text-white" to="/auth">
                  Login
                </Link>
              </NavLink>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
