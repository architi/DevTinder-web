import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    // adds more users to the end of the deck, skipping any already in it
    appendToFeed: (state, action) => {
      const current = state ?? [];
      const known = new Set(current.map((user) => user._id));

      const newUsers = action.payload.filter((user) => {
        if (known.has(user._id)) return false;

        known.add(user._id);
        return true;
      });

      return [...current, ...newUsers];
    },
    removeUserFromFeed: (state, action) =>
      state ? state.filter((user) => user._id !== action.payload) : state,
    removeFeed: () => null,
  },
});

export const { addFeed, appendToFeed, removeUserFromFeed, removeFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
