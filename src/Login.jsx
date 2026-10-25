import { useState } from "react";
import axios from "axios";

const devs = [
  {
    id: "pr",
    initials: "PR",
    name: "Priya, 27",
    role: "Frontend engineer · Bengaluru",
    bio: "Building a design-to-code tool. Need a backend co-founder.",
    stack: ["React", "TypeScript", "Figma"],
    color: "#5B2EA6",
    shared: ["React", "open source"],
  },
  {
    id: "ar",
    initials: "AR",
    name: "Arjun, 29",
    role: "Backend engineer · Delhi",
    bio: "Rust and Postgres nerd. Weekend hackathon regular.",
    stack: ["Rust", "Postgres", "Docker"],
    color: "#E2634B",
    shared: ["hackathons"],
  },
  {
    id: "sk",
    initials: "SK",
    name: "Sara, 31",
    role: "ML engineer · Pune",
    bio: "Shipping small AI tools. Looking for a UI-minded partner.",
    stack: ["Python", "PyTorch", "FastAPI"],
    color: "#2E7D6B",
    shared: ["AI side projects"],
  },
];

// Classes that fly the top card off the screen
const exitStyles = {
  none: "",
  left: "-translate-x-[140%] -rotate-[14deg] opacity-0",
  right: "translate-x-[140%] rotate-[14deg] opacity-0",
};

// One developer card. "position" decides where it sits in the stack.
const DevCard = ({ dev, position }) => {
  return (
    <div
      className={
        "absolute inset-0 rounded-[28px] border border-black/5 bg-white p-5 text-left text-[#1a1033] shadow-2xl transition-all duration-300 dark:border-transparent dark:bg-[#fbf3ea] " +
        position
      }
    >
      <div className="flex items-center gap-3">
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-extrabold text-white"
          style={{ background: dev.color }}
        >
          {dev.initials}
        </div>
        <div>
          <div className="font-display text-[22px] font-extrabold leading-tight">
            {dev.name}
          </div>
          <div className="text-[13px] text-[#1a1033]/60">{dev.role}</div>
        </div>
      </div>

      <p className="mb-2.5 mt-3.5 text-[15px]">{dev.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {dev.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-[#2a1457]/10 px-2.5 py-1 text-xs font-semibold"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="absolute inset-x-5 bottom-4 border-t border-dashed border-[#1a1033]/20 pt-2.5 text-[13px] text-[#1a1033]/60">
        You both like{" "}
        <b className="text-[#1a1033]">{dev.shared.join(" and ")}</b>
      </div>
    </div>
  );
};

const SwipeDeck = () => {
  const [index, setIndex] = useState(0); // which developer is on top
  const [exit, setExit] = useState("none"); // "none" | "left" | "right"

  // % wraps the number back to 0 after the last developer
  const top = devs[index];
  const middle = devs[(index + 1) % devs.length];
  const back = devs[(index + 2) % devs.length];

  const swipe = (direction) => {
    if (exit !== "none") return; // ignore clicks while a card is flying away

    setExit(direction); // 1. card flies away

    const wait = direction === "right" ? 950 : 350;
    setTimeout(() => {
      setIndex((index + 1) % devs.length); // 2. next developer on top
      setExit("none");
    }, wait);
  };

  return (
    <div>
      <div className="relative isolate mx-auto h-[290px] w-full max-w-[330px] md:mx-0">
        {/* The key includes index so each card is redrawn fresh after a swipe */}
        <DevCard
          key={back.id + index}
          dev={back}
          position="z-0 scale-90 translate-y-7 opacity-50"
        />
        <DevCard
          key={middle.id + index}
          dev={middle}
          position="z-10 scale-95 translate-y-3.5 opacity-80"
        />
        <DevCard
          key={top.id + index}
          dev={top}
          position={"z-20 " + exitStyles[exit]}
        />

        <div
          className={
            "pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-accent px-6 py-3.5 font-display text-[22px] font-extrabold text-accent-content transition-all duration-300 " +
            (exit === "right" ? "scale-100 opacity-100" : "scale-75 opacity-0")
          }
        >
          Merged!
        </div>
      </div>

      <div className="mt-14 flex justify-center gap-3 md:justify-start">
        <button
          type="button"
          onClick={() => swipe("left")}
          className="btn h-[50px] rounded-full border-base-content/15 bg-base-content/5 px-6"
        >
          Pass
        </button>
        <button
          type="button"
          onClick={() => swipe("right")}
          className="btn btn-primary h-[50px] rounded-full px-6"
        >
          Send request!
        </button>
      </div>
    </div>
  );
};

const inputStyle =
  "input validator h-[50px] w-full border-base-content/15 bg-base-100/60 focus:border-primary focus:outline-primary/40";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // stop the page from reloading
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:7777/login",
        { emailId, password },
        { withCredentials: true }, // lets the browser store the login cookie
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-5xl items-center gap-12 px-6 py-10 md:grid-cols-2 md:gap-16">
      {/* Left: the pitch */}
      <section className="text-center md:justify-self-end md:text-left">
        <h1 className="mx-auto mb-3.5 max-w-[10.5em] font-display text-4xl font-extrabold leading-none tracking-tight md:mx-0 md:text-5xl lg:text-6xl">
          Your next co-founder is one swipe away.
        </h1>
        <p className="mx-auto mb-8 max-w-md text-lg text-base-content/70 md:mx-0">
          Match with developers by stack, side project and what you want to
          build next.
        </p>
        <SwipeDeck />
      </section>

      {/* Right: login card */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md justify-self-center rounded-[28px] border border-base-content/15 bg-white/60 p-6 shadow-2xl backdrop-blur-xl md:justify-self-start lg:p-8 dark:bg-white/[0.07]"
      >
        <div className="mb-5 flex items-center gap-2.5 text-[13px] text-base-content/70">
          <div className="flex">
            {devs.map((dev) => (
              <span
                key={dev.id}
                style={{ background: dev.color }}
                className="-ml-2 grid h-[30px] w-[30px] place-items-center rounded-full border-2 border-base-100 font-display text-[11px] font-extrabold text-white first:ml-0"
              >
                {dev.initials}
              </span>
            ))}
          </div>
          <span>Priya, Arjun and others are waiting</span>
        </div>

        <h2 className="mb-5 font-display text-3xl font-extrabold leading-tight tracking-tight">
          Welcome back
        </h2>

        {/* GITHUB login to implement later
        <button
          type="button"
          className="btn h-[50px] w-full rounded-2xl border-base-content/15 bg-base-content/5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Continue with GitHub
        </button>

        <div className="divider my-4 text-[13px] text-base-content/60">
          or use email
        </div> */}

        <fieldset className="fieldset">
          <label className="label font-semibold text-base-content">Email</label>
          <input
            type="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className={inputStyle}
            placeholder="you@example.com"
            required
          />
          <p className="validator-hint hidden">Enter a valid email</p>
        </fieldset>

        <fieldset className="fieldset mt-1">
          <label className="label font-semibold text-base-content">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyle}
            placeholder="••••••••"
            required
          />
          <p className="validator-hint hidden">Enter your password</p>
        </fieldset>

        {error && <p className="mt-4 text-sm text-error">{error}</p>}

        <button
          className="btn btn-primary mt-6 h-14 w-full rounded-full font-display text-[17px] font-extrabold"
          type="submit"
        >
          Log in
        </button>

        <p className="mt-5 text-center text-sm text-base-content/70">
          New here?{" "}
          <a className="link font-bold text-base-content decoration-primary underline-offset-4">
            Create your profile
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
