import { useSelector, useDispatch } from "react-redux";
import defaultAvatar from "../assets/default-avatar.png";
import { Link, navigate } from "react-router-dom";
import { removeUser } from "@/utils/userSlice";
import axios  from "axios";
import { BASE_URL } from "@/utils/constants";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async() =>{
    try{
      await axios.get(BASE_URL+"/logout",{},{withCredentials:true})

      //clearing the redux store and redirecting user to login page
      dispatch(removeUser())
      
      return navigate("/login")
    }catch(err){
      console.log(err)
    }
  } 

  return (

       <header className="sticky top-0 z-50 backdrop-blur-md bg-base-100/50">
      <div className="navbar mx-auto max-w-6xl px-6">
        <div className="flex-1">
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
            DevTinder<span className="text-primary">.</span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {/* Greeting: left of the avatar, one line, first name in a different color */}
            <p className="hidden whitespace-nowrap text-sm font-medium text-base-content/80 sm:block">
              Welcome,{" "}
              <span className="font-display font-extrabold text-secondary">
                {user.firstName}
              </span>
            </p>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                  <img
                    alt="Your profile"
                    src={user.photoUrl || defaultAvatar}
                    onError={(e) => {
                      e.target.onerror = null; // stops an infinite loop if the fallback fails too
                      e.target.src = defaultAvatar;
                    }}
                    className="object-cover"
                  />
                </div>
              </div>

              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content z-20 mt-3 w-52 rounded-box border border-base-content/15 bg-base-100 p-2 shadow-xl"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge badge-accent badge-sm">New</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li > 
                  <a onClick={handleLogout()}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
