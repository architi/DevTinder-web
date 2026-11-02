import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";

const Connections = () => {
//fetching data
    const fetchConnections = async()=>{
        try{

            const res = await axios.get(BASE_URL+"/user/connections", {withCredentials:true,});

            console.log(res);

        }catch(err){
            console.error(
              err.response?.data?.message ||
                "Something went wrong while fetching connections.",
            );
        }
    }

useEffect(()=>{
    fetchConnections();
},[]);

  return (
    <div>
      

    </div>
  )
}

export default Connections
