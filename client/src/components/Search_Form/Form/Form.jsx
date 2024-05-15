import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

// local needs
import "./Form.css";

const Form = (props) => {
    const [searchParams] = useSearchParams();
    const user = useSelector((state) => state.user);
    const memories_url = useSelector((state) => state.urls.memories);
    const [id, setId] = props.id;
    const [form, setForm] = props.form;
    const [mode, setMode] = props.mode;
    const [, setPosts] = props.posts;
    const [, setLength] = props.length;
    const [, setLimit] = props.limit;

    const formHandler = async (e) => {
        e.preventDefault();
        if (mode) {
            if (
                form.title !== "" &&
                form.description !== "" &&
                form.tags !== "" &&
                form.image !== ""
            ) {
                const formData = new FormData();
                formData.append("creator", user.username);
                formData.append("creatorEmail", user.email);
                formData.append("title", form.title);
                formData.append("description", form.description);
                formData.append("tags", form.tags.split(" "));
                formData.append("image", form.image);

                axios
                    .post(memories_url, formData, {
                        headers: {
                            Authorization: "Bearer " + user.token,
                        },
                    })
                    .then(() => {
                        axios
                            .get(
                                memories_url +
                                    `?page=${
                                        searchParams.get("page") || 1
                                    }&search=${
                                        searchParams.get("search") || "none"
                                    }&tags=${
                                        searchParams.get("tags") || "none"
                                    }`
                            )
                            .then((res) => {
                                setPosts(res.data.memories);
                                setLength(res.data.length);
                                setLimit(res.data.limit);
                            });

                        setForm({
                            title: "",
                            description: "",
                            tags: "",
                            image: "",
                        });
                        document.querySelector("#file").value = "";
                    })
                    .catch((err) => {
                        setPosts("rejected");
                        setLength(0);
                        setLimit(0);
                    });
            }
        } else {
            if (
                form.title !== "" &&
                form.description !== "" &&
                form.tags !== ""
            ) {
                axios
                    .patch(
                        memories_url + id,
                        {
                            data: {
                                title: form.title,
                                description: form.description,
                                tags: form.tags.split(" "),
                            },
                        },
                        {
                            headers: {
                                Authorization: "Bearer " + user.token,
                            },
                        }
                    )
                    .then(() => {
                        axios
                            .get(
                                memories_url +
                                    `?page=${
                                        searchParams.get("page") || 1
                                    }&search=${
                                        searchParams.get("search") || "none"
                                    }&tags=${
                                        searchParams.get("tags") || "none"
                                    }`
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

                        setForm({
                            title: "",
                            description: "",
                            tags: "",
                            image: "",
                        });
                        setMode(true);
                        setId(null);
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log(err.response);
                    });
            }
        }
    };

    return (
        <form
            action=""
            onSubmit={formHandler}
            className="d-flex flex-column gap-2 custom-shadow rounded bg-white p-4 w-100"
        >
            <h2 className="h3 text-dark text-center">
                {mode ? "Create a Memory" : "Update a Memory"}
            </h2>

            {/* inputs */}
            <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                value={form.title}
                onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                }}
                required={true}
                className={`special-input w-100${
                    form.title.length > 0 ? " active" : ""
                }`}
            />

            <textarea
                rows="4"
                name="description"
                id="description"
                placeholder="Description"
                value={form.description}
                onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                }}
                required={true}
                style={{ resize: "none" }}
                className={`special-input w-100${
                    form.description.length > 0 ? " active" : ""
                }`}
            ></textarea>

            <input
                type="text"
                name="tags"
                id="tags"
                placeholder="Tags"
                value={form.tags}
                onChange={async (e) => {
                    setForm({ ...form, tags: e.target.value });
                }}
                required={true}
                className={`special-input${
                    form.tags.length > 0 ? " active" : ""
                }`}
            />

            <input
                type="file"
                name="file"
                id="file"
                onChange={(e) => {
                    setForm({ ...form, image: e.target.files[0] });
                }}
            />

            {/* actions */}
            <button className="btn btn-primary rounded-0">
                {mode ? "Submit" : "Update"}
            </button>
            <div
                onClick={() => {
                    document.querySelector("#file").value = "";
                    setForm({
                        title: "",
                        description: "",
                        tags: "",
                        image: "",
                    });
                    if (!mode) setMode(true);
                }}
                className="btn btn-danger rounded-0"
            >
                {mode ? "Clear" : "Cancel"}
            </div>
        </form>
    );
};

export default Form;
