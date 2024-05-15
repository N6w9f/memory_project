import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { sign_token } from "./store/reducers/user.reducer";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";

// local
import "./App.css";
import Navbar from "./components/Navbar/Navbar";

import Posts from "./components/Posts/Posts";
import SearchForm from "./components/Search_Form/SearchForm";

import Sign from "./pages/Sign";

// logic
const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [length, setLength] = useState(0);
    const [limit, setLimit] = useState(0);
    const [posts, setPosts] = useState("loading");

    // Form
    const [id, setId] = useState(null);
    const [mode, setMode] = useState(true);
    const [form, setForm] = useState({
        title: "",
        description: "",
        tags: "",
        image: "",
    });

    useEffect(() => {
        const cookie = new Cookies();
        if (/\w+\.\w+\.\w+/.test(cookie.get("profile"))) {
            const info = decodeToken(cookie.get("profile"));
            dispatch(
                sign_token({
                    username: info.username,
                    avatar: info.avatar,
                    email: info.email,
                    likes: info.likes,
                    token: cookie.get("profile"),
                })
            );
        }
    }, [dispatch]);

    return (
        <div className="app bg-light">
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route
                        path=""
                        element={
                            <div className="grid">
                                <Posts
                                    id={[id, setId]}
                                    form={[form, setForm]}
                                    mode={[mode, setMode]}
                                    posts={[posts, setPosts]}
                                    length={[length, setLength]}
                                    limit={[limit, setLimit]}
                                />
                                <SearchForm
                                    id={[id, setId]}
                                    form={[form, setForm]}
                                    mode={[mode, setMode]}
                                    posts={[posts, setPosts]}
                                    length={[length, setLength]}
                                    limit={[limit, setLimit]}
                                />
                            </div>
                        }
                    />
                    <Route
                        path="sign"
                        element={user.isSignIn ? <Navigate to="/" /> : <Sign />}
                    />
                    <Route path="memory/:_id" element={<h1>Hello World</h1>} />
                </Route>

                {/* if this page is not handled this line will automatically navigate user to the homepage */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};
export default App;
