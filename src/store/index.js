import { configureStore } from "@reduxjs/toolkit"; 
import { setupListeners } from "@reduxjs/toolkit/query";
import { quizzesApi } from "./apis/quizzesApi";
import { quizResultsApi } from "./apis/quizResultsApi";
import { authApi } from "./apis/authApi";
import { apiSlice } from "./apis/authApi";
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [quizzesApi.reducerPath]: quizzesApi.reducer,
    [quizResultsApi.reducerPath]: quizResultsApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
    .concat(quizzesApi.middleware)
    .concat(quizResultsApi.middleware)
    .concat(apiSlice.middleware)
  },
  devTools: true
});

setupListeners(store.dispatch);

export { useFetchQuizzesQuery, useFetchQuizQuery } from "./apis/quizzesApi";
export { useFetchQuizResultsQuery, useFetchIndividualResultsQuery, useAddQuizResultMutation } from "./apis/quizResultsApi";
export { useLoginMutation, useSignupMutation, useRecreateTokenMutation, useLogoutMutation } from "./slices/authApiSlice";
export { setCredentials, logOut, selectCurrentToken, selectCurrentUser, selectCurrentAvatar } from "./slices/authSlice"