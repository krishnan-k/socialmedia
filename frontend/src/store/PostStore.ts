import { makeAutoObservable } from "mobx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Post {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  dislikes: number;
  comments: string[];
  userId: string;
}

class PostStore {
  posts: Post[] = [];
  userId: string | null = localStorage.getItem("userId") || null;
  token: string | null = localStorage.getItem("token") || null;
  isAuthenticated: boolean = !!this.token;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(id: string | null, token: string | null) {
    this.userId = id;
    this.token = token;
    this.isAuthenticated = !!token;

    if (id && token) {
      localStorage.setItem("userId", id);
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
  }

  logout() {
    this.setUser(null, null);
    this.posts = [];
  }

  async fetchPosts() {
    try {
      const response = await axios.get<Post[]>("/api/postimage/imagesget");
      this.posts = response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async addPost(newPost: Omit<Post, "_id" | "likes" | "dislikes" | "comments">) {
    if (!this.token) return;
    try {
      const response = await axios.post<Post>(
        "/api/postimage/imagespost",
        { ...newPost, userId: this.userId },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
      this.posts.push(response.data);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }

  async deletePost(id: string) {
    if (!this.token) return;
    try {
      await axios.delete(`/api/postimage/imagesdelete/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      this.posts = this.posts.filter((post) => post._id !== id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }
}

const postStore = new PostStore();
export default postStore;
