import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { sign_out } from "../../store/reducers/user.reducer";

// local needs
import "./Navbar.css";
import memories_logo from "../assets/memories-Logo.png";
import memories_text from "../assets/memories-Text.png";

// logic
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const uploads_url = useSelector((state) => state.urls.uploads);

    const signHandler = () => {
        if (user.isSignIn) {
            dispatch(sign_out());
        } else {
            navigate("/sign");
        }
    };

    return (
        <>
            <nav className="d-flex justify-content-between align-items-center rounded custom-shadow bg-white py-4 px-5 mb-4">
                <div
                    onClick={() => {
                        navigate("/");
                    }}
                    className="logo d-flex align-items-center gap-2"
                >
                    <img src={memories_text} alt="text" className="text" />
                    <img src={memories_logo} alt="logo" className="logo mt-2" />
                </div>

                <div className="sign d-flex align-items-center gap-4">
                    {user.isSignIn && (
                        <>
                            <img src={uploads_url + user.avatar} alt="" />

                            <h4 className="m-0">{user.username}</h4>
                        </>
                    )}

                    <button
                        onClick={signHandler}
                        className={`btn btn-outline-${
                            user.isSignIn ? "danger" : "primary"
                        } btn-lg rounded-0`}
                    >
                        {user.isSignIn ? "Sign out" : "Sign in"}
                    </button>
                </div>
            </nav>

            <Outlet />
        </>
    );
};

export default Navbar;
