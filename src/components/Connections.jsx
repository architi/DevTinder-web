import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";

import { BASE_URL } from "@/utils/constants";
import { addConnections } from "@/utils/connectionsSlice";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MAX_SKILLS = 4;

// Same glass look as your login card
const glass =
  "rounded-2xl border-base-content/15 bg-white/60 text-base-content shadow-md dark:bg-white/[0.07]";

/* One connection */
const ConnectionCard = ({ person }) => {
  const { firstName = "", lastName = "", photoUrl, age, gender, about, skills = [] } = person;

  const fullName = `${firstName} ${lastName ?? ""}`.trim();
  const initials = `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  const meta = [age ? `${age} yrs` : null, gender].filter(Boolean).join(" · ");
  const shownSkills = skills.slice(0, MAX_SKILLS);
  const hiddenCount = skills.length - shownSkills.length;

  return (
    <Card
      className={
        glass +
        " gap-0 p-0 transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      }
    >
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0 ring-1 ring-base-content/15">
            <AvatarImage src={photoUrl} alt={fullName} className="object-cover" />
            <AvatarFallback className="bg-muted font-display text-base font-bold text-muted-foreground">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold leading-tight">{fullName}</h2>
            {meta && <p className="text-xs capitalize text-base-content/70">{meta}</p>}
          </div>
        </div>

        {about ? (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-base-content/80">{about}</p>
        ) : (
          <p className="text-[13px] italic text-base-content/60">No bio yet.</p>
        )}

        {shownSkills.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {shownSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="rounded-full border-base-content/20 px-2 py-0 text-[11px] font-medium text-base-content"
              >
                {skill}
              </Badge>
            ))}
            {hiddenCount > 0 && (
              <Badge variant="outline" className="rounded-full border-base-content/20 px-2 py-0 text-[11px] font-normal text-base-content/70">
                +{hiddenCount}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* Placeholder while loading */
const CardSkeleton = () => (
  <Card className={glass + " gap-0 p-0"} aria-hidden="true">
    <CardContent className="animate-pulse space-y-3 p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-base-content/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-base-content/10" />
          <div className="h-3 w-1/3 rounded bg-base-content/10" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-base-content/10" />
        <div className="h-3 w-4/5 rounded bg-base-content/10" />
      </div>
      <div className="flex gap-2">
        <div className="h-4 w-12 rounded-full bg-base-content/10" />
        <div className="h-4 w-14 rounded-full bg-base-content/10" />
      </div>
    </CardContent>
  </Card>
);

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchConnections = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      setError("We couldn't load your connections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Search by name or skill
  const q = query.trim().toLowerCase();
  const visible = connections.filter((c) => {
    if (!q) return true;
    const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.toLowerCase();
    const hasSkill = (c.skills ?? []).some((s) => s.toLowerCase().includes(q));
    return name.includes(q) || hasSkill;
  });

  const count = connections.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-base-content md:text-3xl">
            Your connections
          </h1>
          {!loading && !error && (
            <p className="mt-0.5 text-sm text-base-content/70">
              {count} {count === 1 ? "developer" : "developers"} ready to build with you
            </p>
          )}
        </div>

        {!loading && !error && count > 0 && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or skill"
              aria-label="Search connections"
              className="h-10 rounded-full border-base-content/15 bg-base-100/60 pl-10 text-sm text-base-content placeholder:text-base-content/50 focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className={glass + " mx-auto max-w-sm border p-6 text-center"}>
          <p className="font-display text-lg font-bold">Something broke</p>
          <p className="mt-1.5 text-sm text-base-content/70">{error}</p>
          <button type="button" onClick={fetchConnections} className="btn btn-primary btn-sm mt-5 rounded-full px-5">
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && count === 0 && (
        <div className={glass + " mx-auto max-w-sm border p-6 text-center"}>
          <p className="font-display text-xl font-bold">404: Spark Not Found</p>
          <p className="mt-1.5 text-sm text-base-content/70">
            No connections yet. Send a few requests and the accepted ones will show up here.
          </p>
          <Link to="/" className="btn btn-primary btn-sm mt-5 rounded-full px-5">
            Browse developers
          </Link>
        </div>
      )}

      {/* Search found nothing */}
      {!loading && !error && count > 0 && visible.length === 0 && (
        <p className="py-10 text-center text-base-content/70">
          No connections match &ldquo;{query.trim()}&rdquo;.
        </p>
      )}

      {/* List */}
      {!loading && !error && visible.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((person) => (
            <ConnectionCard key={person._id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;