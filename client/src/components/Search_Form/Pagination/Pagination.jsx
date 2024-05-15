import React from "react";
import { useSearchParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import "./Pagination.css";

const Pagination = (props) => {
    const [searchParams] = useSearchParams();
    const [paginate] = props.paginate;

    const activeHandler = (pag) => {
        const page = pag || 1;
        const search = searchParams.get("search") || "none";
        const tags = searchParams.get("tags") || "none";

        if (!(+(searchParams.get("page") || 1) === +pag)) {
            window.location.search = `page=${page}&search=${search}&tags=${tags}`;
        }
    };

    return (
        <div className="pagination rounded-bottom custom-shadow bg-white py-2 px-4 w-100">
            <ul className="d-flex align-items-center gap-2 p-0 m-0">
                <li>
                    <button
                        onClick={() => {
                            const page = searchParams.get("page") || 1;

                            if (page > 1) {
                                window.location.search = `page=${
                                    page - 1
                                }&search=${
                                    searchParams.get("search") || "none"
                                }&tags=${searchParams.get("tags") || "none"}`;
                            }
                        }}
                        className={`${
                            (searchParams.get("page") || 1) > 1 ? "" : "enough "
                        }btn btn-outline-dark d-flex align-items-center rounded-5 py-2`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </li>

                {paginate.map((pag) => (
                    <li key={pag}>
                        <button
                            onClick={() => {
                                activeHandler(pag);
                            }}
                            className={`${
                                +(searchParams.get("page") || 1) === +pag
                                    ? "active "
                                    : ""
                            }btn btn-outline-dark d-flex align-items-center rounded-5 py-1`}
                        >
                            {pag}
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        onClick={() => {
                            const page = searchParams.get("page") || 1;

                            if (page < paginate.length) {
                                window.location.search = `page=${
                                    +page + 1
                                }&search=${
                                    searchParams.get("search") || "none"
                                }&tags=${searchParams.get("tags") || "none"}`;
                            }
                        }}
                        className={`${
                            searchParams.get("page") < paginate.length
                                ? ""
                                : "enough "
                        }btn btn-outline-dark d-flex align-items-center rounded-5 py-2`}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
