import axios from "axios";

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://photon-backend-c8wj.onrender.com";
export const http = axios.create({ baseURL:  BASE_API_URL});
