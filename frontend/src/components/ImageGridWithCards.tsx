import React, { useEffect, useState } from "react";
import "../component-css/ImageGrid.css";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { RiMessage2Line } from "react-icons/ri";
import { Button, TextField } from "@mui/material";

interface Comment {
  text: string;
  timestamp: string; 
}


interface Picture {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  comments: string[];
}

const ImageGridWithCards: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [likedImages, setLikedImages] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  
  const fetchPictures = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/postimage/imagesget"
      );
      const data: Picture[] = await response.json();
      setPictures(data);
    } catch (error) {
      console.error("Error fetching pictures:", error);
    }
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  // Like
  const handleLike = async (
    id: string,
    isLiked: boolean,
    currentLikes: number
  ) => {
    const updatedLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
    setLikedImages((prevState) => ({ ...prevState, [id]: !isLiked }));

    // Update the likes
    const updatedPictures = pictures.map((picture) => {
      if (picture._id === id) {
        return {
          ...picture,
          likes: updatedLikes,
        };
      }
      return picture;
    });
    setPictures(updatedPictures);
  };

  // comment input
  const handleCommentChange = (id: string, comment: string) => {
    setNewComment((prevState) => ({
      ...prevState,
      [id]: comment,
    }));
  };

  // Submit comment
  const handlePostComment = async (id: string) => {
    const comment = newComment[id];
    if (!comment) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/postimage/imagespost/${id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        }
      );
      const updatedImage = await response.json();


      setPictures((prevPictures) =>
        prevPictures.map((picture) =>
          picture._id === id
            ? { ...picture, comments: updatedImage.comments }
            : picture
        )
      );
      setNewComment((prevState) => ({ ...prevState, [id]: "" })); 
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="image-section">
      <div className="picture-grid">
        {pictures.map((picture) => (
          <div key={picture._id} className="img-card">
            <div className="img-inner-bg">
              <img
                className="img-class"
                src={picture.imageUrl}
                alt={picture.title}
              />
            </div>
            <div className="img-inner-content">
              <div className="card-body">
                <button
                  className="like-btn-main like-btn"
                  onClick={() =>
                    handleLike(
                      picture._id,
                      likedImages[picture._id] || false,
                      picture.likes
                    )
                  }
                >
                  {likedImages[picture._id] ? (
                    <>
                      <BiSolidLike />
                      <span className="like-btn">Liked</span>
                    </>
                  ) : (
                    <>
                      <BiLike />
                      <span className="like-btn">Like</span>
                    </>
                  )}
                  <span className="like-btn">({picture.likes})</span>
                </button>
                <h5 className="card-title">
                  <button className="command-btn">
                    <RiMessage2Line />
                    <span className="like-btn">{picture.comments.length} Comment</span>
                  </button>
                </h5>
              </div>
              <div className="comment-section">
                <div className="input-field">
                  <TextField
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[picture._id] || ""}
                    fullWidth
                    onChange={(e) =>
                      handleCommentChange(picture._id, e.target.value)
                    }
                  />
                  <Button
                    onClick={() => handlePostComment(picture._id)}
                    variant="contained"
                    sx={{ marginTop: 2 }}
                  >
                    Post
                  </Button>
                </div>

                
                <div className="comments">
                  {picture.comments.map((comment, index) => (
                    <div key={index} className="comment">
                      {comment}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGridWithCards;
