import express from "express";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const uniqueSuffix = `${Date.now()}_${Math.random() * 1e9}`;
        cb(null, `${file.originalname}_${uniqueSuffix}.${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    const type = file.mimetype.split("/")[0];
    type === "image" ? cb(null, true) : cb("Only accept images", false);
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// controllers
import { sign_in, sign_up } from "./controller.js";

const usersRouter = express.Router();
usersRouter.route("/").post(sign_up);
usersRouter.route("/signin").post(sign_in);

export default usersRouter;
