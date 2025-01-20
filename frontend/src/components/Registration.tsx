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
        "http://localhost:5000/api/register",
        { email, username, password }
      );
      const loginResponse = await axios.post(
        "http://localhost:5000/api/login",
        { email, password }
      );
      localStorage.setItem("token", loginResponse.data.token); 

      alert("Registration and login successful");
      navigate("/login");
    } catch (error) {
      alert("Error during registration or login");
    }
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-submit" onClick={handleRegister}>
          Register
        </button>
        <Button
        className="btn-text"
          onClick={() => navigate("/login")}
          variant="text"
          color="primary"
        >
          Already have an account? Login
        </Button>
      </Container>
    </div>
    
  );
};

export default Registration;
