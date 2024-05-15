import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

import { useSelector } from "react-redux";
import axios from "axios";

// local needs
import "./Posts.css";
import Post from "./Post/Post";
const Posts = (props) => {
    const [searchParams] = useSearchParams();
    const memories_url = useSelector((state) => state.urls.memories);
    const [posts, setPosts] = props.posts;
    const [, setLength] = props.length;
    const [, setLimit] = props.limit;

    useEffect(() => {
        setPosts("loading");
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
            })
            .catch((err) => {
                setPosts("rejected");
                setLength(0);
                setLimit(0);
            });
    }, [memories_url, searchParams, setPosts, setLength, setLimit]);

    return (
        <>
            {posts === "loading" ? (
                <PropagateLoader
                    className="d-flex justify-content-center align-items-center"
                    color="#212529"
                />
            ) : posts === "rejected" ? (
                <div className="alert alert-dark">
                    <h1 className="alert-heading">
                        Sorry something went wrong
                    </h1>
                    <hr />
                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="fresh-button text-dark text-decoration-underline"
                    >
                        Refresh the page?
                    </button>
                </div>
            ) : (
                <div className="posts grid-300">
                    {posts.map((post) => (
                        <Post
                            key={post._id}
                            _id={post._id}
                            image={post.image}
                            creator={post.creator}
                            creatorEmail={post.creatorEmail}
                            updated_at={post.updated_at}
                            tags={post.tags}
                            title={post.title}
                            description={post.description}
                            likes={post.likes}
                            form={props.form}
                            mode={props.mode}
                            id={props.id}
                            posts={props.posts}
                            length={props.length}
                            limit={props.limit}
                        />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;
