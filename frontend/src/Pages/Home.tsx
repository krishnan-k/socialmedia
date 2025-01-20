import React from "react";
import ImageGridWithCards from "../components/ImageGridWithCards";
import LeftBar from "../components/Leftbar";
import RightBar from "../components/Rightbar";
const Home = () => {
  return (
    <div className="home page" style={{ display: "grid", gridTemplateColumns: ".3fr 1fr auto" }}>
      <LeftBar/>
      <ImageGridWithCards />
      <RightBar/>
    </div>
  );
};

export default Home;
