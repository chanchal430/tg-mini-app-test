import { User } from "@privy-io/react-auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  accessToken: string | null;
  user: User | null;
}

const initialState: UserState = {
  accessToken: null,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ accessToken: string, user : User }>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    clearUser(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
