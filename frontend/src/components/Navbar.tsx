import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import "../component-css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [activeState, setActiveState] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/Create", label: "New Post" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="navbar-section">
      <div className="navbar-content">
        <div className="header-section">
          <div className="logo">
          </div>
          <div className="navigation">
            <ul>
              {navLinks.map((link, index) => (
                <li
                  key={index}
                  className={`${activeState === index ? "active" : ""}`}
                  onClick={() => setActiveState(index)}
                >
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="account-icon ms-2 me-0">
          {isLoggedIn ? (
            <button
              className="nav-link text-uppercase ms-2 me-2 fw-normal fx"
              onClick={handleLogout}
            >
              <FaUserAlt />
              <div className="account_section">
                <p className="address-login m-0">Log out</p>
              </div>
            </button>
          ) : (
            <div className="account_login">
              <Link
                className="nav-link text-uppercase ms-2 me-2 fw-normal fx"
                to="/login"
              >
                <FaUserAlt />
                <div className="account_section">
                  <p className="address-login m-0">Log in</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
