import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

// local needs
import "./Post.css";
import { like } from "../../../store/reducers/user.reducer";

const Post = (props) => {
    const user = useSelector((state) => state.user);
    const memories_url = useSelector((state) => state.urls.memories);
    const image_url = useSelector((state) => state.urls.uploads);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [, setForm] = props.form;
    const [, setMode] = props.mode;
    const [, setId] = props.id;
    const [, setPosts] = props.posts;
    const [, setLength] = props.length;
    const [, setLimit] = props.limit;
    const [likeTimeout, setLikeTimeout] = useState(true);

    const likeHandler = async (_id) => {
        if (user.isSignIn) {
            if (likeTimeout) {
                setLikeTimeout(false);
                dispatch(like({ _id, email: user.email, token: user.token }));

                setTimeout(() => {
                    axios
                        .get(
                            memories_url +
                                `?page=${
                                    searchParams.get("page") || 1
                                }&search=${
                                    searchParams.get("search") || "none"
                                }&tags=${searchParams.get("tags") || "none"}`
                        )
                        .then((res) => {
                            setPosts(res.data.memories);
                            setLength(res.data.length);
                            setLimit(res.data.limit);
                            setLikeTimeout(true);
                        })
                        .catch(() => {
                            setPosts("rejected");
                            setLength(0);
                            setLimit(0);
                        });
                }, 1000);
            }
        }
    };
    const delete_memory = (_id) => {
        axios
            .delete(memories_url + _id, {
                headers: {
                    Authorization: "Bearer " + user.token,
                },
            })
            .then((res) => {
                setForm({
                    title: "",
                    description: "",
                    tags: "",
                    image: "",
                });

                axios
                    .get(
                        memories_url +
                            `?page=${searchParams.get("page") || 1}&search=${
                                searchParams.get("search") || "none"
                            }&tags=${searchParams.get("tags") || "none"}`
                    )
                    .then((res) => {
                        setPosts(res.data.memories);
                        setLength(res.data.length);
                        setLimit(res.data.limit);
                    });
            })
            .catch((err) => console.log(err.response));
    };

    return (
        <div className="post d-flex flex-column rounded-top-4 rounded-bottom-3 custom-shadow bg-white">
            <div className="upper">
                <div className="img rounded-top-4">
                    <img
                        src={image_url + props.image}
                        alt=""
                        className="w-100 rounded-top-4"
                    />
                </div>
                <div className="text">
                    <div className="creator-edit d-flex justify-content-between align-items-center">
                        <h4 className="text-light m-0">{props.creator}</h4>
                        {props.creatorEmail === user.email && user.isSignIn && (
                            <button
                                onClick={() => {
                                    if (props.creatorEmail === user.email) {
                                        setForm({
                                            title: props.title,
                                            description: props.description,
                                            tags: props.tags.join(" "),
                                        });
                                        setMode(false);
                                        setId(props._id);
                                    }
                                }}
                                className="fresh-button text-light fs-4 p-0"
                            >
                                <FontAwesomeIcon icon={faEllipsis} />
                            </button>
                        )}
                    </div>

                    <p className="lead fs-6 text-light m-0">
                        {moment(props.updated_at).fromNow()}
                    </p>
                </div>
            </div>

            <div className="lower d-flex flex-column justify-content-between rounded-bottom-3 p-3">
                <div
                    onClick={() => {
                        navigate(`/memory/${props._id}`);
                    }}
                    className="text d-flex flex-column gap-1 mb-3"
                >
                    <span className="lead fs-6 m-0">
                        {props.tags.map((tag) => `#${tag} `)}
                    </span>
                    <h4 className="text-dark text-capitalize m-0">
                        {props.title}
                    </h4>
                    <p className="lead lead-400 fs-6 lh-sm m-0">
                        {props.description}
                    </p>
                </div>

                <div className="actions d-flex justify-content-between align-items-center">
                    <div
                        className={`like d-flex align-items-center gap-1${
                            user.isSignIn ? "" : " notLogged"
                        }`}
                    >
                        {
                            <button
                                onClick={() => {
                                    likeHandler(props._id);
                                }}
                                className={`fresh-button text-${
                                    props.likes.includes(user.email)
                                        ? "danger"
                                        : "primary"
                                } p-0`}
                            >
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                        }
                        <p
                            className={`lead-400 text-${
                                props.likes.includes(user.email)
                                    ? "danger"
                                    : "primary"
                            } m-0`}
                        >
                            {props.likes.length}{" "}
                            {props.likes.length <= 1 ? "Like" : "Likes"}
                        </p>
                    </div>
                    {props.creatorEmail === user.email && (
                        <button
                            onClick={() => delete_memory(props._id)}
                            className="fresh-button text-dark p-0"
                        >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Post;
