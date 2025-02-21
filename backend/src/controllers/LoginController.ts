import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/UserModel";
import JwtToken from "../utils/JwtToken";

class LoginController {
  async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    try {
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      
      const token = JwtToken.generateToken({
        id: user._id,
        email: user.email,
      });

      res.status(200).json({ message: "Login successful", token, userId: user._id });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default LoginController;

