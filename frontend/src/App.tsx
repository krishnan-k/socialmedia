import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react";
import postStore from "./store/PostStore";
import Home from "./Pages/Home";
import AddImage from "./Pages/Create";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { Container } from "@mui/material";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return postStore.isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = observer(() => {
  return (
    <BrowserRouter>
      <Navbar />
      <Container maxWidth="lg">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <AddImage />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
});

export default App;
