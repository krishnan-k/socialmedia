import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import AddImage from "./Pages/Create";
import { Container } from "@mui/material";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="App">
      <Container maxWidth="xl">
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Create" element={<AddImage />} />
            <Route path="/register" element={<Registration/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </BrowserRouter>
      </Container>
    </div>
  );
};

export default App;
