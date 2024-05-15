import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// local needs
import "./SearchForm.css";
import Search from "./Search/Search";
import Form from "./Form/Form";
import Pagination from "./Pagination/Pagination";

const SearchForm = (props) => {
    const [length] = props.length;
    const [limit] = props.limit;
    const user = useSelector((state) => state.user);

    const [paginate, setPaginate] = useState([]);

    useEffect(() => {
        let array = [];
        for (let i = 0; i < Math.ceil(length / limit); i++) {
            array.push(i + 1);
        }
        setPaginate(array);
    }, [length, limit]);

    return (
        <div className="search-form d-flex flex-column align-items-center gap-2">
            <div className="sticky d-flex flex-column align-items-center gap-2">
                <Search />
                {user.isSignIn ? (
                    <Form
                        id={props.id}
                        form={props.form}
                        mode={props.mode}
                        posts={props.posts}
                        length={props.length}
                        limit={props.limit}
                    />
                ) : (
                    <div className="text-center custom-shadow bg-white p-4">
                        <p>You got to sign in if you want to create a memory</p>
                    </div>
                )}
                {paginate.length > 1 && (
                    <Pagination
                        posts={props.posts}
                        length={props.length}
                        limit={props.limit}
                        paginate={[paginate, setPaginate]}
                    />
                )}
            </div>
        </div>
    );
};
export default SearchForm;
