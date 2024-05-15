import { createSlice } from "@reduxjs/toolkit";
const url = "https://memory-backend-kx62.onrender.com/api/";

const urls = createSlice({
    initialState: {
        memories: url + "memories/",
        uploads: url + "uploads/",
    },
    name: "urls",
});

export default urls.reducer;
