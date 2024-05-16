import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        validate: {
            validator: (value) => /\w{8,}/.test(value),
            message: () => "Password should be 8 characters or more",
        },
    },
    token: {
        type: String,
        validate: {
            validator: (value) => /\w+\.\w+\.\w+/.test(value),
            message: () => "Not a valid token",
        },
    },
    avatar: {
        type: String,
        default: "profile.webp",
    },
    likes: [String],
});

const Users = mongoose.model("users", usersSchema);

export default Users;
