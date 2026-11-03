import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "@/utils/requestSlice";
import { useEffect } from "react";

const Requests = () => {
  const requests = useSelector((store)=>store.requests);
  const dispatch = useDispatch();

  const fetchRequest = async() => {
    try{
      const res = await axios.get(BASE_URL + "/user/request/received", {withCredentials:true,
      });

      dispatch(addRequests(res.data.data));

    }catch(err){
      console.error("ERROR:", err.response?.data || err.message);
    }
  }

  useEffect(()=>{
    fetchRequest();
  },[])

  return (
    <div>
      
    </div>
  )
}

export default Requests
