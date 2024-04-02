import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const fetchQuizzes = createAsyncThunk('quizzes/fetch', async () => {
  const response = await axios.get("http://localhost:9091/api/v1/quizzes");
  return response.data;
})

export { fetchQuizzes}