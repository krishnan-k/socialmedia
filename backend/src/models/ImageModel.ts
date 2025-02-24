import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  likedBy: string[];
  dislikes: number;
  dislikedBy: string[];
  comments: string[]; 
}

const imageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    dislikes: { type: Number, default: 0 }, 
    dislikedBy: { type: [String], default: [] },
    comments: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Image = mongoose.model<IImage>('Image', imageSchema);
export default Image;