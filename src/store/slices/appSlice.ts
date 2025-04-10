import { createSlice, createAsyncThunk, Reducer, ThunkAction } from "@reduxjs/toolkit";
import { completeTaskAPI, getInviteId, getTasks, Task, TaskResponse } from "../../services/appService";
import { RootState } from "..";

export interface AppState {
  referralId: string;
  isLoading: boolean;
  error: string | null;
  tasks: TaskResponse;
  loading: boolean;
}

const initialState: AppState = {
  referralId: "",
  isLoading: false,
  error: null,
  tasks: { dailyTasks: [], weeklyTasks: [], monthlyTasks: [] },
  loading: false,
};

// Async thunk to fetch referral ID
export const fetchReferralId = createAsyncThunk(
  "app/fetchReferralId",
  async (telegramUserId: string, { rejectWithValue }) => {
    try {
      const data = await getInviteId(telegramUserId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch referral ID");
    }
  }
);

export const fetchTasks = createAsyncThunk(
    "app/fetchTasks",
    async (telegramUserId: string, { rejectWithValue }) => {
      try {
        return await getTasks(telegramUserId);
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );

  export const completeTask: any = createAsyncThunk(
    "app/completeTask",
    async (
      {
        telegramUserId,
        task,
        taskType,
      }: { telegramUserId: string; task: Task; taskType: keyof TaskResponse },
      { dispatch, rejectWithValue }
    ) => {
      try {
        await completeTaskAPI(telegramUserId, task.id, taskType, task.coins);
        dispatch(fetchTasks(telegramUserId));
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );
  

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetReferralId: (state) => {
      state.referralId = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReferralId.fulfilled, (state, action) => {
        state.referralId = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchReferralId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { resetReferralId } = appSlice.actions;

export default appSlice.reducer as Reducer<AppState>;;
