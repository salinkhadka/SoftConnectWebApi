import axios from "./api"
export const registerUserApi=(data)=>axios.post("auth/register",data);
export const loginUserApi=(data)=>axios.post("auth/Login",data);