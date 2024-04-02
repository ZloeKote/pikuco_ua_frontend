import { createSlice } from "@reduxjs/toolkit";
import { fetchQuizzes } from "../thunks/fetchQuizzes";

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  extraReducers(builder) {
    builder.addCase(fetchQuizzes.pending, (state, action) => {
        state.isLoading = true;
    });
    builder.addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
    });
    builder.addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
    });
  }
})

export const quizzesReducer = quizzesSlice.reducer;