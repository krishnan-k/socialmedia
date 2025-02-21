import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";
import postStore from "../store/PostStore";
import image1 from "../images/i1.png";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId); // Store user ID
      postStore.setUser(response.data.userId, response.data.token);
      alert("Login successfully");
      navigate("/");
    } catch (error) {
      alert("This email address and password are not registered, so please register and log in.");
    }
  };
  return (
    <div
      className=""
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row-reverse",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        marginTop: "50px",
        borderRadius: "30px",
        padding: "50px",
        gap: "50px",
      }}
    >
      <div className="image_section">
        <img
          src={image1}
          alt="image"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <Container component="main" maxWidth="xs">
        <h1
          style={{
            paddingBottom: "40px",
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          Sign In
        </h1>
        <form>
          <div>
            <label className="label">Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" className="btn-submit " onClick={handleLogin}>
            Login
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: "8px",
              fontSize: "14px",
              color: "#00000057",
            }}
          >
            Dont't have an account?
            <span
              style={{
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "8px",
                marginRight: "8px",
              }}
              className="btn-text btn-submit"
              onClick={() => navigate("/register")}
            >
              Register Here
            </span>
          </p>
        </form>
      </Container>
    </div>
  );
};

export default Login;
