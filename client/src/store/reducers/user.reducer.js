import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();
const url = "http://localhost:4000/api/users/";

export const sign_up = createAsyncThunk("user/sign_up", async (object) => {
    const user = await axios
        .post(url, {
            data: {
                username: object.username,
                email: object.email,
                password: object.password,
            },
        })
        .then((res) => res.data);

    return user;
});
export const sign_in = createAsyncThunk("user/sign_in", async (object) => {
    const user = await axios
        .post(url + "signin", {
            data: {
                email: object.email,
                password: object.password,
            },
        })
        .then((res) => res.data);

    return user;
});

export const like = createAsyncThunk("user/like", async (object) => {
    const result = await axios
        .post(
            "http://localhost:4000/api/memories/like/" + object._id,
            {
                data: {
                    email: object.email,
                },
            },
            {
                headers: {
                    Authorization: "Bearer " + object.token,
                },
            }
        )
        .then((res) => res.data);

    return result;
});

const user = createSlice({
    initialState: {
        isSignIn: false,
    },
    name: "user",
    reducers: {
        sign_out: (state, action) => {
            cookie.remove("profile");
            return {
                isSignIn: false,
            };
        },
        sign_token: (state, action) => {
            return {
                isSignIn: true,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sign_up.fulfilled, (state, action) => {
            cookie.set("profile", action.payload.token);
            return {
                isSignIn: true,
                ...action.payload,
            };
        });
        builder.addCase(sign_in.fulfilled, (state, action) => {
            cookie.set("profile", action.payload.token);
            return {
                isSignIn: true,
                ...action.payload,
            };
        });
        builder.addCase(like.fulfilled, (state, action) => {
            cookie.set("profile", action.payload.token);
            return {
                isSignIn: true,
                ...action.payload,
            };
        });
    },
});

export const { sign_out, sign_token } = user.actions;
export default user.reducer;
