import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { addConnections } from "@/utils/connectionsSlice";
import { useDispatch, useSelector } from "react-redux";

const Connections = () => {

  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));

    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if(!connections)return;

  if(connections.length === 0) return <h1> 404:Spark Not Found</h1>;

  return (
    <div>
     
    </div>
  );
};

export default Connections;
