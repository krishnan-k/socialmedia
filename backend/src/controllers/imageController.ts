import { Request, Response } from "express";
import * as imageService from "../view/imageService";
import Image from "../models/ImageModel";

// image post
export const createImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, imageUrl, description, tags } = req.body;

    if (!title || !imageUrl || !description || !tags) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newImage = await imageService.createImage({
      title,
      imageUrl,
      description,
      tags,
    });
    res.status(201).json(newImage);
  } catch (error: any) {
    console.error("Error creating image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get all image
export const getAllImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tag } = req.query;
    let images;
    images = await imageService.getAllImages();
    res.status(200).json(images);
  } catch (error: any) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: error.message });
  }
};

// get unique image
export const getImageById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const image = await imageService.getImageById(id);

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    res.status(200).json(image);
  } catch (error: any) {
    console.error("Error fetching image by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

// update image
export const updateImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedImage = await imageService.updateImage(id, req.body);

    if (!updatedImage) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    res.status(200).json(updatedImage);
  } catch (error: any) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: error.message });
  }
};

// delete image
export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedImage = await imageService.deleteImage(id);

    if (!deletedImage) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: error.message });
  }
};

export const likeImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    const image = await Image.findById(id);
    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    if (image.likedBy.includes(userId)) {
      image.likes -= 1;
      image.likedBy = image.likedBy.filter((user) => user !== userId);
    } else {
      image.likes += 1;
      image.likedBy.push(userId);
      
      if (image.dislikedBy.includes(userId)) {
        image.dislikes -= 1;
        image.dislikedBy = image.dislikedBy.filter((user) => user !== userId);
      }
    }

    await image.save();
    res.status(200).json({ likes: image.likes, likedBy: image.likedBy });
  } catch (error) {
    console.error("Error liking image:", error);
    res.status(500).json({ message: "Error liking image" });
  }
};

export const dislikeImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const image = await Image.findById(id);
    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    if (image.dislikedBy.includes(userId)) {
      image.dislikes -= 1;
      image.dislikedBy = image.dislikedBy.filter((user) => user !== userId);
    } else {
      image.dislikes += 1;
      image.dislikedBy.push(userId);

      
      if (image.likedBy.includes(userId)) {
        image.likes -= 1;
        image.likedBy = image.likedBy.filter((user) => user !== userId);
      }
    }

    await image.save();
    res.status(200).json({ likes: image.likes, dislikedBy: image.dislikedBy, dislikes: image.dislikes });
  } catch (error) {
    console.error("Error disliking image:", error);
    res.status(500).json({ message: "Error disliking image" });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const image = await imageService.getImageById(id);

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    image.comments.push(comment);
    await image.save();

    res.status(200).json(image);
  } catch (error: any) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: error.message });
  }
};
