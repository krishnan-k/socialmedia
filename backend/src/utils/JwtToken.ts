import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

class JwtToken {
  static generateToken(payload: object, expiresIn = "1h"): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  }

  static verifyToken(token: string): object | string {
    return jwt.verify(token, SECRET_KEY);
  }
}
export default JwtToken;
