import React, { useEffect, useState } from "react";
import "../component-css/ImageGrid.css";
import { Button, TextField } from "@mui/material";
import heart from "../images/heart.svg";
import heart1 from "../images/heart1.png";
import message from "../images/message.svg";
import send from "../images/send.svg";
import { MdDelete } from "react-icons/md";
import { Bounce, toast, ToastContainer } from "react-toastify";

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

  // Fetch all pictures
  const fetchPictures = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/postimage/imagesget"
      );
      const data: Picture[] = await response.json();
      setPictures(data); // Ensure state is updated with fresh data, avoiding duplicates
    } catch (error) {
      console.error("Error fetching pictures:", error);
    }
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  // Handle like/unlike
  const handleLike = async (
    id: string,
    isLiked: boolean,
    currentLikes: number
  ) => {
    const updatedLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
    setLikedImages((prevState) => ({ ...prevState, [id]: !isLiked }));

    // Update the likes in state
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

  // Handle comment input change
  const handleCommentChange = (id: string, comment: string) => {
    setNewComment((prevState) => ({
      ...prevState,
      [id]: comment,
    }));
  };

  // Submit a comment
  const handlePostComment = async (id: string) => {
    const comment = newComment[id];
    if (!comment) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/postimage/imagespost/${id}/comment`,
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

  // Delete a post
  const handleDeletePost = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/postimage/imagesdelete/${id}`, {
        method: "DELETE",
      });

      // Remove the deleted post from the state
      setPictures((prevPictures) =>
        prevPictures.filter((picture) => picture._id !== id)
      );
      toast.error("Post delete successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
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
                <div className="post_content">
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
                      <img className="img-class" src={heart1} alt="heart" />
                    ) : (
                      <img className="img-class" src={heart} alt="heart" />
                    )}
                    <span className="like-btn">({picture.likes})</span>
                  </button>
                  <div className="card-title">
                    <button className="command-btn">
                      <img className="img-class" src={message} alt="message" />
                      <span className="like-btn">
                        {picture.comments.length} Comments
                      </span>
                    </button>
                  </div>
                </div>
                <div className="delete_post">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePost(picture._id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
              <div className="image_title">
                <h4>{picture.title}</h4>
                <p>{picture.description}</p>
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
                    <img className="img-class" src={send} alt="send" />
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
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default ImageGridWithCards;
