import React, { useState } from "react";
import { useDispatch } from "react-redux";

import "./css/Sign.css";
import { sign_in, sign_up } from "../store/reducers/user.reducer";
const Sign = () => {
    const dispatch = useDispatch();
    const [signData, setSignData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [signInUp, setSignInUp] = useState(true);

    const formHandler = async (e) => {
        e.preventDefault();

        if (
            /^[a-z A-Z]\w+@\w+\.\w+/.test(signData.email) &&
            /\w{8,}/.test(signData.password)
        ) {
            if (signInUp) {
                dispatch(
                    sign_in({
                        email: signData.email,
                        password: signData.password,
                    })
                );
            } else {
                dispatch(
                    sign_up({
                        username: signData.username,
                        email: signData.email,
                        password: signData.password,
                    })
                );
            }
        }
    };
    return (
        <div className="sign py-5">
            <form
                onSubmit={formHandler}
                action=""
                className="d-flex flex-column gap-3 custom-shadow bg-white p-4 mx-auto"
            >
                <h3 className="text-capitalize m-0">
                    {signInUp ? "Sign in" : "Sign up"}
                </h3>
                {!signInUp && (
                    <input
                        onChange={(e) => {
                            setSignData({
                                ...signData,
                                username: e.target.value,
                            });
                        }}
                        type="text"
                        name="username"
                        id="username"
                        required={true}
                        placeholder="Username"
                        className="special-input"
                    />
                )}

                <input
                    onChange={(e) => {
                        setSignData({ ...signData, email: e.target.value });
                    }}
                    type="email"
                    name="email"
                    id="email"
                    required={true}
                    placeholder="Email"
                    className="special-input"
                />

                <input
                    onChange={(e) => {
                        setSignData({ ...signData, password: e.target.value });
                    }}
                    type="text"
                    name="password"
                    id="password"
                    required={true}
                    placeholder="Password"
                    className="special-input"
                />

                <button className="btn btn-primary btn-lg rounded-0">
                    Sign {signInUp ? "in" : "up"}
                </button>
                <p>
                    {signInUp ? "Create a new account" : "Already have one"}{" "}
                    <span
                        onClick={() => {
                            setSignInUp(!signInUp);
                        }}
                        className="text-primary text-decoration-underline cursor-pointer"
                    >
                        Sign {signInUp ? "up" : "ip"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Sign;
