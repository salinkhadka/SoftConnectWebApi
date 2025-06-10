import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api"; // fixed "locahost" typo and added "http://"

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json" // fixed "Content=type" typo
  }
});

export default instance;
