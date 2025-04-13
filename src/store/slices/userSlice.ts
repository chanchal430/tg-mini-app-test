import { createSlice, PayloadAction, createAsyncThunk, Reducer } from "@reduxjs/toolkit";
import {
    connectWallet,
    getUserData,
    saveTelegramId,
    updateTapPoints,
} from "../../services/userService";

export const fetchUserData = createAsyncThunk(
    "user/fetchUserData",
    async (telegramUserId: string) => {
        return await getUserData(telegramUserId);
    }
);

export const postTapPoints = createAsyncThunk(
    "user/postTapPoints",
    async ({ telegramUserId, points }: { telegramUserId: string; points: number }) => {
        return await updateTapPoints(telegramUserId, points);
    }
);

export interface UserState {
    telegramUserId: string | null;
    tapPoints: number;
    taskPoints: number;
    totalPoints: number;
    name: string;
    loading: boolean;
}

const initialState: UserState = {
    telegramUserId: null,
    tapPoints: 0,
    taskPoints: 0,
    totalPoints: 0,
    name: "",
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setTelegramUserId: (state, action: PayloadAction<string>) => {
            state.telegramUserId = action.payload;
        },
        incrementTapPoints: (state) => {
            state.tapPoints += 1;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.tapPoints = action.payload.tapPoints;
            state.taskPoints = action.payload.taskPoints;
            state.totalPoints = action.payload.totalPoints;
            state.name = `${action.payload.firstName || ""} ${action.payload.lastName || ""}`.trim();
        });
        builder.addCase(postTapPoints.fulfilled, (state, action) => {
            state.tapPoints = action.payload.updatedTapPoints;
            state.totalPoints = action.payload.updatedTotalPoints;
        });
    },
});

export const { setTelegramUserId, incrementTapPoints } = userSlice.actions;

export default userSlice.reducer as Reducer<UserState>;;
