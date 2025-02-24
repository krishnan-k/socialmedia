import express from "express";

import * as imageController from "../controllers/imageController";
const router = express.Router();

// router request
router.post('/imagespost', imageController.createImage);
router.get("/imagesget", imageController.getAllImages);
router.get("/imagesget/:id", imageController.getImageById);
router.put("/imagesupdate/:id", imageController.updateImage);
router.delete("/imagesdelete/:id", imageController.deleteImage);
router.get("/imagesget", imageController.getAllImages);
router.post("/imageslike/:id", imageController.likeImage);
router.post("/imagesdislike/:id", imageController.dislikeImage);
router.post('/imagespost/:id/comment', imageController.addComment);

export default router;
