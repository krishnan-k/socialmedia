import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/UserModel";
import JwtToken from "../utils/JwtToken";


class RegisterController {
  async register(req: Request, res: Response): Promise<any> {
    const { username, email, password } = req.body;

    try {
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const newUser: IUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      const token = JwtToken.generateToken({
        id: newUser._id,
        email: newUser.email,
      });

      res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default RegisterController;
