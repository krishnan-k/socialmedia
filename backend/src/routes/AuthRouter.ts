import { Router } from "express";
import RegisterController from "../controllers/RegisterController";
import LoginController from "../controllers/LoginController";

const router = Router();
const registerController = new RegisterController();
const loginController = new LoginController();

router.post("/register", registerController.register);
router.post("/login", loginController.login);

export default router;
