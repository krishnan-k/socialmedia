import { makeAutoObservable } from "mobx";

class PostStore {
  posts: any[] = [];
  userId: string | null = localStorage.getItem("userId");
  token: string | null = localStorage.getItem("token");

  constructor() {
    makeAutoObservable(this);
  }
  get isAuthenticated(): boolean {
    return !!this.token;
  }
  setUser(userId: string, token: string): void {
    this.userId = userId;
    this.token = token;
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
  }

  logout(): void {
    this.userId = null;
    this.token = null;
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  }
  async fetchPosts() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/postimage/imagesget"
      );
      this.posts = await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async likePost(postId: string) {
    try {
      const response = await fetch(`http://localhost:8000/api/postimage/imageslike/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ userId: this.userId }), // Send userId in request
      });
  
      if (!response.ok) {
        throw new Error("Failed to like post");
      }
  
      const updatedPost = await response.json();
  
      // Update MobX state with new likes count
      this.posts = this.posts.map((post) =>
        post._id === postId ? { ...post, likes: updatedPost.likes, likedBy: updatedPost.likedBy } : post
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }
  
  async dislikePost(postId: string) {
    try {
      const response = await fetch(`http://localhost:8000/api/postimage/imagesdislike/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ userId: this.userId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to dislike post");
      }
  
      const updatedPost = await response.json();
  
      this.posts = this.posts.map((post) =>
        post._id === postId ? { ...post, likes: updatedPost.likes, dislikedBy: updatedPost.dislikedBy, dislikes: updatedPost.dislikes } : post
      );
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  }
  
  commentPost(id: string, comment: string): void {
    try {
      fetch(`http://localhost:8000/api/postimage/imagespost/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      })
        .then((response) => response.json())
        .then((updatedPost) => {
          this.posts = this.posts.map((post) =>
            post._id === id ? updatedPost : post
          );
        })
        .catch((error) => {
          console.error("Error posting comment:", error);
        });
    } catch (error) {
      console.error("Error in commentPost:", error);
    }
  }

  async deletePost(id: string) {
    try {
      await fetch(`http://localhost:8000/api/postimage/imagesdelete/${id}`, {
        method: "DELETE",
      });
      this.posts = this.posts.filter((post) => post._id !== id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
}

const postStore = new PostStore();
export default postStore;
