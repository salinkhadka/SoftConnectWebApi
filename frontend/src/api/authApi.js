import axios from "./api"


export const registerUserApi = (data) =>
  axios.post("user/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const loginUserApi=(data)=>axios.post("user/login",data);

