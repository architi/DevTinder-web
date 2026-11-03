import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "@/utils/requestSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MAX_SKILLS = 3;

const glass =
  "rounded-2xl border-base-content/15 bg-white/60 text-base-content shadow-md dark:bg-white/[0.07]";

const primaryBtn = "bg-[#ff7b5c] text-[#1a1033] hover:bg-[#ff7b5c]/90";

/* One incoming request */
const RequestRow = ({ request, row, onReview }) => {
  const sender = request.fromUserId;
  const {
    firstName = "",
    lastName = "",
    photoUrl,
    age,
    gender,
    about,
    skills = [],
  } = sender;

  const fullName = `${firstName} ${lastName ?? ""}`.trim();
  const initials = `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  const meta = [age ? `${age} yrs` : null, gender].filter(Boolean).join(" · ");
  const shownSkills = skills.slice(0, MAX_SKILLS);
  const hiddenCount = skills.length - shownSkills.length;

  const busy = row.status === "working";

  return (
    <Card
      className={
        glass +
        " gap-0 p-0 transition-all duration-300 motion-reduce:transition-none " +
        (row.status === "rejected" ? "-translate-x-4 opacity-0" : "")
      }
    >
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        {/* Who */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0 ring-2 ring-[#ff7b5c]/60">
            <AvatarImage
              src={photoUrl}
              alt={fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted font-display text-base font-bold text-muted-foreground">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-bold leading-tight">
              {fullName}
            </h2>
            {meta && (
              <p className="text-xs capitalize text-base-content/70">{meta}</p>
            )}
            <p className="mt-1 line-clamp-1 text-[13px] text-base-content/80">
              {about || (
                <span className="italic text-base-content/60">No bio yet.</span>
              )}
            </p>

            {shownSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
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
                  <Badge
                    variant="outline"
                    className="rounded-full border-base-content/20 px-2 py-0 text-[11px] font-normal text-base-content/70"
                  >
                    +{hiddenCount}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions, or the Merged! moment after accepting */}
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {row.status === "accepted" ? (
            <span className="rounded-full bg-[#ff7b5c] px-5 py-2 text-center font-display text-sm font-extrabold text-[#1a1033]">
              Merged!
            </span>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={busy || row.status === "rejected"}
                onClick={() => onReview("rejected", request._id)}
                className="h-10 flex-1 rounded-full px-4 sm:flex-none"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
              <Button
                type="button"
                disabled={busy || row.status === "rejected"}
                onClick={() => onReview("accepted", request._id)}
                className={
                  "h-10 flex-1 rounded-full px-4 font-bold sm:flex-none " +
                  primaryBtn
                }
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
            </div>
          )}

          {row.error && <p className="text-xs text-error">{row.error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

/* Placeholder while loading */
const RowSkeleton = () => (
  <Card className={glass + " gap-0 p-0"} aria-hidden="true">
    <CardContent className="flex animate-pulse items-center gap-3 p-4">
      <div className="h-12 w-12 rounded-full bg-base-content/10" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-base-content/10" />
        <div className="h-3 w-2/3 rounded bg-base-content/10" />
      </div>
      <div className="h-10 w-24 rounded-full bg-base-content/10" />
    </CardContent>
  </Card>
);

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState({}); // per request: { status, error }

  const fetchRequest = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      setError("We couldn't load your requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const setRow = (id, patch) =>
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  // status is "accepted" or "rejected"
  const review = async (status, requestId) => {
    setRow(requestId, { status: "working", error: "" });
    try {
      await axios.post(
        `${BASE_URL}/request/receive/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      setRow(requestId, { status });
      // let "Merged!" be read / the row fade, then drop it from the list
      setTimeout(
        () => dispatch(removeRequest(requestId)),
        status === "accepted" ? 1000 : 300,
      );
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === "string" ? data : data?.message;

      setRow(requestId, {
        status: "idle",
        error: msg || "Something went wrong.",
      });
    }
  };

  // Skip any request whose sender no longer exists
  const list = (requests ?? []).filter((r) => r.fromUserId);
  const count = list.length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-base-content md:text-3xl">
          Connection requests
        </h1>
        {!loading && !error && (
          <p className="mt-0.5 text-sm text-base-content/70">
            {count === 0
              ? "You're all caught up"
              : `${count} ${count === 1 ? "developer wants" : "developers want"} to connect with you`}
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className={glass + " mx-auto max-w-sm border p-6 text-center"}>
          <p className="font-display text-lg font-bold">Something broke</p>
          <p className="mt-1.5 text-sm text-base-content/70">{error}</p>
          <button
            type="button"
            onClick={fetchRequest}
            className="btn btn-primary btn-sm mt-5 rounded-full px-5"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && count === 0 && (
        <div className={glass + " mx-auto max-w-sm border p-6 text-center"}>
          <p className="font-display text-xl font-bold">No pending requests</p>
          <p className="mt-1.5 text-sm text-base-content/70">
            New requests will show up here. Meanwhile, keep swiping.
          </p>
          <Link
            to="/"
            className="btn btn-primary btn-sm mt-5 rounded-full px-5"
          >
            Browse developers
          </Link>
        </div>
      )}

      {/* List */}
      {!loading && !error && count > 0 && (
        <div className="space-y-3">
          {list.map((request) => (
            <RequestRow
              key={request._id}
              request={request}
              row={rows[request._id] ?? { status: "idle", error: "" }}
              onReview={review}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
