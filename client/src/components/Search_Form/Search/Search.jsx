import { useState } from "react";

// local needs
import "./Search.css";

const Search = () => {
    const [searchForm, setSearchForm] = useState({ search: "", tags: "" });

    const searchHandler = (e) => {
        e.preventDefault();
        const search = searchForm.search || "none";
        const tags = searchForm.tags || "none";

        window.location.search = `page=1&search=${search}&tags=${tags}`;
    };
    return (
        <div className="search rounded-top custom-shadow bg-white p-4 w-100">
            <form
                action=""
                className="d-flex flex-column gap-2d-flex flex-column gap-2"
                onSubmit={searchHandler}
            >
                <input
                    onChange={(e) => {
                        setSearchForm({
                            ...searchForm,
                            search: e.target.value,
                        });
                    }}
                    type="text"
                    name="by-memories"
                    id="by-memories"
                    placeholder="Search Memories"
                    value={searchForm.search}
                    className="special-input w-100"
                />
                <input
                    onChange={(e) => {
                        setSearchForm({ ...searchForm, tags: e.target.value });
                    }}
                    type="text"
                    name="by-tags"
                    id="by-tags"
                    placeholder="Search Tags"
                    value={searchForm.tags}
                    className="special-input letter-space w-100"
                />

                <button className="letter-space btn btn-primary text-uppercase rounded-0">
                    Search
                </button>
            </form>
        </div>
    );
};
export default Search;
