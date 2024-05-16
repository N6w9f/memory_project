import bcrypt from "bcryptjs";

import Users from "../../models/users.js";
import catcher from "../../utils/catcher.js";
import jwtFn from "../../utils/jsonWebToken.js";
import fail from "../../utils/fails.js";

const sign_in = catcher(async (req, res) => {
    const { email, password } = req.body.data;

    let user = await Users.findOne({ email: email });

    if (user) {
        const passwordValidation = bcrypt.compareSync(password, user.password);

        if (passwordValidation) {
            const newToken = jwtFn({
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                likes: user.likes,
            });

            user = await Users.findOneAndUpdate(
                { email: email },
                { $set: { token: newToken } },
                { new: true }
            );

            res.status(200).json({
                username: user.username,
                avatar: user.avatar,
                email: user.email,
                likes: user.likes,
                token: user.token,
            });
        } else {
            res.status(401).json(fail("Password is wrong"));
        }
    } else {
        res.status(401).json(fail("Email is wrong"));
    }
});
const sign_up = catcher(async (req, res) => {
    const { username, email } = req.body.data;
    let { password } = req.body.data;

    if (/\w{8,}/.test(password)) {
        password = bcrypt.hashSync(password, 10);
    }

    const user = new Users({
        username,
        email,
        password,
        likes: [],
    });
    user.token = jwtFn({
        username,
        email,
        avatar: user.avatar,
        likes: user.likes,
    });
    await user.save();

    res.status(201).json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        likes: user.likes,
        token: user.token,
    });
});

export { sign_in, sign_up };
