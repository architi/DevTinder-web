import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import {useDispatch} from "react-redux";
import { addUser } from "../utils/userSlice";
import {useEffect} from "react";
import { useSelector } from "react-redux";

const Body = () => {
  // making sure the user stays logged in using useEffect for it so it runs only once when the component mounts
  const dispatch = useDispatch();
  const navigate = useNavigate();

//so that only once the fetchUser api is called and removes the need to call it again and again when the user navigates to different pages ince logged in 
 const userData  = useSelector((store)=>store.user);


  const fetchUser = async()=>{
    if (userData) return;
  try {

    const res = await axios.get(BASE_URL + "/profile", {
      withCredentials: true,
    });
    //updating store
    dispatch(addUser(res.data));

  } catch (err) {

    if(err.status === 401){
      navigate("/login");
    }
    else{
      console.error(err);
    }

  }

  }
 
useEffect(()=>{
  fetchUser();
},[])

  return (
    <div className="app-canvas min-h-screen flex flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
