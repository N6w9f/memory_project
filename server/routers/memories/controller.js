import Memories from "../../models/memories.js";
import Users from "../../models/users.js";
import catcher from "../../utils/catcher.js";
import fails from "../../utils/fails.js";
import jwtFn from "../../utils/jsonWebToken.js";

// logic
const get_memories = catcher(async (req, res) => {
    // filter
    const search = req.query.search || "none";
    const tags = req.query.tags || "none";

    const limit = req.query.limit || 8;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const filter =
        search !== "none" && tags !== "none"
            ? { title: search, tags: tags.split(" ") }
            : search !== "none" && tags === "none"
            ? { title: search }
            : tags !== "none" && search === "none"
            ? { tags: tags.split(" ") }
            : {};

    const length = (await Memories.find(filter)).length;
    const memories = await Memories.find(
        filter,
        { __v: false },
        { sort: { created_at: -1 }, limit, skip }
    );

    res.status(200).json({ memories, limit, length });
});

const add_memory = catcher(async (req, res) => {
    const { title, description, tags } = req.body;
    const { filename: image } = req.file;

    const memory = new Memories({
        creator: req.tokenInfo.username,
        creatorEmail: req.tokenInfo.email,
        title: title.toLowerCase(),
        description,
        tags: tags.split(","),
        image,
        likes: [],
        created_at: Date.now(),
        updated_at: Date.now(),
    });
    await memory.save();
    res.status(201).json(memory);
});

const update_memory = catcher(async (req, res) => {
    const _id = req.params._id;
    const { title, description, tags } = req.body.data;

    const memory = await Memories.findById(_id);
    if (memory) {
        if (memory.creatorEmail === req.tokenInfo.email) {
            await Memories.updateOne(
                { _id },
                {
                    $set: {
                        title: title.toLowerCase(),
                        description,
                        tags,
                        updated_at: Date.now(),
                    },
                }
            );
            res.status(200).json({ title: "Done" });
        } else {
            res.status(401).json(
                fails("You're not able to edit this memory with this email")
            );
        }
    } else {
        res.status(200).json(fails("Memory not found"));
    }
});

const delete_memory = catcher(async (req, res) => {
    const _id = req.params._id;

    const memory = await Memories.findById(_id);
    if (memory) {
        if (memory.creatorEmail === req.tokenInfo.email) {
            await Memories.deleteOne({ _id });
            res.status(200).json({ title: "Done" });
        } else {
            res.status(401).json(
                fails("You're not able to delete this memory with this email")
            );
        }
    } else {
        res.status(200).json(fails("Memory not found"));
    }
});

const like = catcher(async (req, res) => {
    const memoryID = req.params._id;
    const email = req.tokenInfo.email;

    const memory = await Memories.findById(memoryID);

    if (memory) {
        const user = await Users.findOne({ email });
        const isLiked = user.likes.some((e) => e === memoryID);

        if (isLiked) {
            const userLikes = user.likes.filter((e) => e !== memoryID);
            const updatedUser = await Users.findOneAndUpdate(
                { email },
                { $set: { likes: userLikes } },
                { new: true }
            );

            const memoryLikes = memory.likes.filter((e) => e !== email);
            await Memories.findOneAndUpdate(
                { _id: memoryID },
                { $set: { likes: memoryLikes } }
            );
            const token = jwtFn({
                username: updatedUser.username,
                email: updatedUser.email,
                likes: updatedUser.likes,
                avatar: updatedUser.avatar,
            });

            res.status(200).json({
                username: updatedUser.username,
                email: updatedUser.email,
                likes: updatedUser.likes,
                avatar: updatedUser.avatar,
                token,
            });
        } else {
            const updatedUser = await Users.findOneAndUpdate(
                { email },
                { $set: { likes: [...user.likes, memoryID] } },
                { new: true }
            );
            await Memories.findOneAndUpdate(
                { _id: memoryID },
                { $set: { likes: [...memory.likes, email] } }
            );
            const token = jwtFn({
                username: updatedUser.username,
                email: updatedUser.email,
                likes: updatedUser.likes,
                avatar: updatedUser.avatar,
            });

            res.status(200).json({
                username: updatedUser.username,
                email: updatedUser.email,
                likes: updatedUser.likes,
                avatar: updatedUser.avatar,
                token,
            });
        }
    } else {
        res.status(404).json(fails("Memory not found"));
    }
});

export { get_memories, add_memory, update_memory, delete_memory, like };
