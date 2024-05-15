import { configureStore } from "@reduxjs/toolkit";

// handlers
import user from "./reducers/user.reducer";
import urls from "./reducers/urls.reducer";

const store = configureStore({
    reducer: {
        user: user,
        urls: urls,
    },
});

export default store;
