import React, { useEffect, useState } from "react";
import "../component-css/ImageGrid.css";
import { Button, TextField } from "@mui/material";
import message from "../images/message.svg";
import send from "../images/send.svg";
import { MdDelete } from "react-icons/md";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { observer } from "mobx-react-lite";
import postStore from "../store/PostStore";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

const ImageGridWithCards: React.FC = observer(() => {
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    postStore.fetchPosts();
  }, []);

  //comment
  const handleCommentChange = (id: string, comment: string) => {
    setNewComment((prevState) => ({ ...prevState, [id]: comment }));
  };

  // Submit a comment
  const handlePostComment = async (id: string) => {
    const comment = newComment[id];
    if (!comment) return;

    await postStore.commentPost(id, comment);
    setNewComment((prevState) => ({ ...prevState, [id]: "" }));
  };

  return (
    <div className="image-section">
      <div className="picture-grid">
        {postStore.posts.map((picture) => (
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
                    className="like-btn"
                    onClick={() => postStore.likePost(picture._id)}
                  >
                    {picture.likedBy.includes(postStore.userId || "") ? (
                      <AiFillLike />
                    ) : (
                      <AiOutlineLike />
                    )}
                    <span>({picture.likes})</span>
                  </button>

                  <button
                    className="dislike-btn like-btn"
                    onClick={() => postStore.dislikePost(picture._id)}
                  >
                    {picture.dislikedBy.includes(postStore.userId || "") ? (
                      <AiFillDislike />
                    ) : (
                      <AiOutlineDislike />
                    )}
                    <span>({picture.dislikes})</span>
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
                    onClick={() => postStore.deletePost(picture._id)}
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
                  {picture.comments.map((comment: string, index: number) => (
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
});

export default ImageGridWithCards;
