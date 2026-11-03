import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

import { BASE_URL } from "@/utils/constants";
import { addFeed, appendToFeed, removeUserFromFeed } from "@/utils/feedSlice";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UserCard from "./UserCard";

const STACK_SPRING = { type: "spring", stiffness: 380, damping: 32 };
const SWIPE_DISTANCE = 110; // px you must drag before it counts as a swipe
const SWIPE_VELOCITY = 500; // or a quick flick faster than this
const FLING_X = 520; // how far the card flies off screen
const VISIBLE = 3; // cards drawn in the deck

/* One card in the deck. Only the top card (index 0) can be dragged. */
const SwipeCard = ({ user, index, total, onDecide }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 160], [-10, 10]);
  const interestedOpacity = useTransform(x, [20, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -20], [1, 0]);

  const flinging = useRef(false);
  const isTop = index === 0;

  // direction: 1 = right (interested), -1 = left (ignored)
  const fling = async (direction) => {
    if (!isTop || flinging.current) return;
    flinging.current = true;

    await animate(x, direction * FLING_X, { duration: 0.22, ease: "easeIn" });

    const ok = await onDecide(
      direction === 1 ? "interested" : "ignored",
      user._id,
    );

    // If the server said no, bring the card back so nothing is lost
    if (!ok) {
      await animate(x, 0, STACK_SPRING);
      flinging.current = false;
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 ${
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
      aria-hidden={!isTop}
      animate={{ y: index * 12, scale: 1 - index * 0.05 }}
      transition={STACK_SPRING}
      style={{ zIndex: total - index, x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY)
          fling(1);
        else if (
          info.offset.x < -SWIPE_DISTANCE ||
          info.velocity.x < -SWIPE_VELOCITY
        )
          fling(-1);
      }}
    >
      <UserCard
        user={user}
        compact
        showActions={isTop}
        onSend={() => fling(1)}
        onPass={() => fling(-1)}
      />

      {isTop && (
        <>
          <motion.span
            style={{ opacity: interestedOpacity }}
            className="pointer-events-none absolute left-4 top-4 z-20 -rotate-6 rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-content"
          >
            Interested
          </motion.span>
          <motion.span
            style={{ opacity: passOpacity }}
            className="pointer-events-none absolute right-4 top-4 z-20 rotate-6 rounded-full border border-base-content/20 bg-base-100 px-3 py-1 text-sm font-extrabold text-base-content"
          >
            Pass
          </motion.span>
        </>
      )}
    </motion.div>
  );
};

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState("");
  const [exhausted, setExhausted] = useState(false); // server has nobody left to show
  const [dismissed, setDismissed] = useState(false); // user closed the "out of data" dialog

  const loadingMore = useRef(false);
  const initialFetch = useRef(false);
  const decided = useRef(new Set()); // ids already swiped, so a late response can't bring them back

  // Ask the backend for the next batch (hides everyone you've swiped on)
  const fetchPage = async () => {
    const res = await axios.get(BASE_URL + "/user/feed", {
      withCredentials: true,
    });
    const users = res.data?.data ?? res.data ?? [];
    return users.filter((u) => !decided.current.has(u._id));
  };

  const getFeed = async () => {
    if (feed || initialFetch.current) return;

    initialFetch.current = true;
    setLoadError(false);

    try {
      dispatch(addFeed(await fetchPage()));
    } catch (err) {
      console.log(err);
      setLoadError(true);
    } finally {
      initialFetch.current = false;
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Running low on cards? Quietly load the next batch so the deck doesn't run dry early.
  useEffect(() => {
    if (!feed || exhausted || feed.length > VISIBLE || loadingMore.current)
      return;
    loadingMore.current = true;

    (async () => {
      try {
        const users = await fetchPage();
        const known = new Set(feed.map((u) => u._id));
        const fresh = users.filter((u) => !known.has(u._id));
        if (fresh.length === 0) setExhausted(true);
        else dispatch(appendToFeed(fresh));
      } catch (err) {
        console.log(err);
      } finally {
        loadingMore.current = false;
      }
    })();
  }, [feed, exhausted]);

  // Saves the swipe in the database. Returns true when the card can leave.
  const decide = async (status, userId) => {
    setActionError("");
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      const msg = err.response?.data?.message;
      // Already has a request with this person: nothing left to do, so just drop the card
      if (typeof msg === "string" && /already/i.test(msg)) {
        decided.current.add(userId);
        dispatch(removeUserFromFeed(userId));
        return true;
      }
      setActionError(msg || "Couldn't save that swipe. Please try again.");
      return false;
    }
    decided.current.add(userId);
    dispatch(removeUserFromFeed(userId));
    return true;
  };

  const checkAgain = () => {
    setDismissed(false);
    setExhausted(false); // the effect above fetches again
  };

  if (loadError)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
        <p className="text-base-content/70">We couldn't load developers.</p>
        <Button type="button" onClick={getFeed}>
          Try again
        </Button>
      </div>
    );

  if (!feed) return <p className="p-10 text-center">Loading…</p>;

  const outOfUsers = feed.length === 0 && exhausted;
  const visible = feed.slice(0, VISIBLE);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
      {visible.length > 0 && (
        <>
          {/* The deck: its size is what controls how big the card is */}
          <div className="relative h-[min(540px,calc(100svh-15rem))] w-[min(320px,calc(100vw-2rem))]">
            {visible.map((user, index) => (
              <SwipeCard
                key={user._id}
                user={user}
                index={index}
                total={visible.length}
                onDecide={decide}
              />
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-base-content/60">
            Drag right to connect, left to pass.
          </p>
        </>
      )}

      {visible.length === 0 && !outOfUsers && (
        <p className="text-base-content/70">Finding developers…</p>
      )}

      {outOfUsers && dismissed && (
        <div className="text-center">
          <p className="text-base-content/70">No new developers right now.</p>
          <Button type="button" onClick={checkAgain} className="mt-4">
            Check again
          </Button>
        </div>
      )}

      {actionError && (
        <p role="alert" className="mt-3 text-sm text-error">
          {actionError}
        </p>
      )}

      {/* when the feed runs out */}
      <Dialog
        open={outOfUsers && !dismissed}
        onOpenChange={(open) => {
          if (!open) setDismissed(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Oops! Out of data.</DialogTitle>
            <DialogDescription>
              Please go outside and interact with physical objects.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={checkAgain}>
              Check again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feed;
