import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
} from "@mui/material";
import "../component-css/Form.css";
import image1 from "../images/i1.png";
const Registration = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !username || !password) {
      alert("All fields are required");
      return;
    }
    try {
      const registerResponse = await axios.post(
        "http://localhost:8000/api/register",
        { email, username, password }
      );
      const loginResponse = await axios.post(
        "http://localhost:8000/api/login",
        { email, password }
      );
      localStorage.setItem("token", loginResponse.data.token);

      alert("Registration successfully");
      navigate("/login");
    } catch (error) {
      alert("Error during registration");
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
          Sign Up
        </h1>
        <form>
          <div>
            <label className="label">User Name</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
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

          <button type="button" className="btn-submit" onClick={handleRegister}>
            Register
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: "8px",
              fontSize: "14px",
              color: "#00000057",
            }}
          >
            Already have an account?
            <span
              style={{
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "8px",
                marginRight: "8px",
              }}
              className="btn-text btn-submit"
              onClick={() => navigate("/login")}
              color="primary"
            >
              Login Here
            </span>
          </p>
        </form>
      </Container>
    </div>
  );
};

export default Registration;
