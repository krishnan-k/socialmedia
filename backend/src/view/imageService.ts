import Image, { IImage } from '../models/ImageModel';

// Create an image
export const createImage = async (imageData: { title: string, description: string, imageUrl: string, tags: string[] }) => {
  try {
    const newImage = new Image({
      ...imageData,
      likes: 0,
    });
    await newImage.save();
    return newImage;
  } catch (error) {
    console.error('Error saving image to DB', error);
    throw error;
  }
};

// Get all images
export const getAllImages = async (): Promise<IImage[]> => {
  return await Image.find();
};

// Get an image by ID
export const getImageById = async (id: string): Promise<IImage | null> => {
  return await Image.findById(id);
};

// Update an image
export const updateImage = async (id: string, updateData: Partial<IImage>) => {
  return await Image.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete an image
export const deleteImage = async (id: string): Promise<IImage | null> => {
  return await Image.findByIdAndDelete(id);
};

export const likeImage = async (id: string, userId: string): Promise<IImage | null> => {
  try {
    const image = await Image.findById(id);
    if (!image) throw new Error("Image not found");

    if (image.likedBy.includes(userId)) {
      // Unlike image
      image.likes -= 1;
      image.likedBy = image.likedBy.filter((id) => id !== userId);
    } else {
      // Like image
      image.likes += 1;
      image.likedBy.push(userId);
    }

    await image.save();
    return image;
  } catch (error) {
    console.error("Error updating likes:", error);
    throw error;
  }
};

// command
export const addCommentToImage = async (id: string, comment: string): Promise<IImage | null> => {
  try {
    const image = await Image.findById(id);
    if (!image) {
      throw new Error('Image not found');
    }

    
    image.comments.push(comment);
    await image.save();

    return image;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
