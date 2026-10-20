const NavBar = () => {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-base-100/50">
      <div className="navbar mx-auto max-w-6xl px-6">
        <div className="flex-1">
          <a className="font-display text-2xl font-extrabold tracking-tight">
            DevTinder<span className="text-primary">.</span>
          </a>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              <img
                alt="Your profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content z-20 mt-3 w-52 rounded-box border border-base-content/15 bg-base-100 p-2 shadow-xl"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge badge-accent badge-sm">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
