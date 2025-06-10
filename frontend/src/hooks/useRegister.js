import { useMutation } from "@tanstack/react-query"; //useMutation is used for POST Put Patch Delete request state
import { registerUserService } from "../services/authService";
// import { data } from "react-router-dom";
import { toast } from "react-toastify";

export const useRegisterUser = () =>{
    return useMutation(
        {
            mutationFn:registerUserService, //what function to run
            mutationKey:['register'],
            onSuccess:(data)=>{
                toast.success(data?.message || "registration sucess")
            },
            onError:(err)=>{ 
                toast.success(err?.message || "registration sucess")
            },
        }
    )
}
//mutationFn:(formData)=> registerUserService(formdata)