import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";
import { addFeed, removeUserFromFeed } from "@/utils/feedSlice";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data?.data ?? res.data)); // works for { data: [...] } or [...]
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err);
    }
    dispatch(removeUserFromFeed(userId));
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return <p className="p-10 text-center">Loading…</p>;

  if (feed.length === 0)
    return <p className="p-10 text-center">No new developers right now.</p>;

  return (
    <div className="px-4 py-8">
      <UserCard
        key={feed[0]._id}
        user={feed[0]}
        onPass={(id) => handleRequest("ignored", id)}
        onSend={(id) => handleRequest("interested", id)}
      />
    </div>
  );
};

export default Feed;
