import { createSlice } from "@reduxjs/toolkit";
const url = "http://localhost:4000/api/";

const urls = createSlice({
    initialState: {
        memories: url + "memories/",
        uploads: url + "uploads/",
    },
    name: "urls",
});

export default urls.reducer;
