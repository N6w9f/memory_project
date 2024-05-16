import express from "express";
import multer from "multer";

// controllers
import {
    get_memories,
    add_memory,
    update_memory,
    delete_memory,
    like,
    get_memory,
} from "./controller.js";
import auth from "../../middlewares/auth.js";
// logic
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

const memoriesRouter = express.Router();
memoriesRouter
    .route("/")
    .get(get_memories)
    .post(auth, upload.single("image"), add_memory);

memoriesRouter.route("/like/:_id").post(auth, like);
memoriesRouter
    .route("/:_id")
    .get(get_memory)
    .patch(auth, update_memory)
    .delete(auth, delete_memory);

export default memoriesRouter;
