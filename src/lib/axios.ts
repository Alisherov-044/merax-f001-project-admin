import axios from "axios";

export const Axios = axios.create({ 
    baseURL: "https://pickbazar-api-kjy8.onrender.com/api",
    withCredentials: false
});
